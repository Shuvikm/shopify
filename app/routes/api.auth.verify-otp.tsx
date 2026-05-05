import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import * as bcrypt from 'bcrypt-ts';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ok: false, error: 'Method not allowed'}, {status: 405});
  }

  const {session} = context as any;

  const formData = await request.formData();
  const submittedOtp = formData.get('otp') as string;
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  const name = (formData.get('name') as string | null) ?? '';

  if (!submittedOtp) {
    return json({ok: false, error: 'OTP is required'}, {status: 400});
  }

  // Read OTP data from session
  const storedOtp = session.get('otp');
  const otpExpiry = session.get('otpExpiry');
  const otpEmail = session.get('otpEmail');
  const otpPhone = session.get('otpPhone');

  // Validate OTP exists
  if (!storedOtp || !otpExpiry) {
    return json({ok: false, error: 'Invalid or expired OTP'}, {status: 400});
  }

  // Validate OTP not expired
  const expiryTime = parseInt(otpExpiry, 10);
  if (isNaN(expiryTime) || Date.now() > expiryTime) {
    // Clear expired OTP from session
    session.unset('otp');
    session.unset('otpExpiry');
    session.unset('otpEmail');
    session.unset('otpPhone');
    return json(
      {ok: false, error: 'Invalid or expired OTP'},
      {
        status: 400,
        headers: {'Set-Cookie': await session.commit()},
      },
    );
  }

  // Validate OTP matches
  if (submittedOtp.trim() !== storedOtp) {
    return json({ok: false, error: 'Invalid or expired OTP'}, {status: 400});
  }

  // Determine the identifier (email or phone)
  const resolvedEmail = email || otpEmail;
  const resolvedPhone = phone || otpPhone;

  if (!resolvedEmail && !resolvedPhone) {
    return json({ok: false, error: 'Email or phone is required'}, {status: 400});
  }

  try {
    const {getPrisma} = await import('~/lib/db.server');
    const prisma = await getPrisma();

    let user = null;
    let isNewUser = false;

    if (resolvedEmail) {
      user = await prisma.user.findUnique({where: {email: resolvedEmail}});

      if (!user) {
        // Create new user with a random secure password (they use OTP to log in)
        const randomPassword = Math.random().toString(36) + Math.random().toString(36);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user = await prisma.user.create({
          data: {
            email: resolvedEmail,
            password: hashedPassword,
            name: name || resolvedEmail.split('@')[0],
          },
        });
        isNewUser = true;
      }
    } else if (resolvedPhone) {
      // For phone-based users, use phone as a pseudo-email key
      const phoneEmail = `phone:${resolvedPhone}`;
      user = await prisma.user.findUnique({where: {email: phoneEmail}});

      if (!user) {
        const randomPassword = Math.random().toString(36) + Math.random().toString(36);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user = await prisma.user.create({
          data: {
            email: phoneEmail,
            password: hashedPassword,
            name: name || resolvedPhone,
          },
        });
        isNewUser = true;
      }
    }

    if (!user) {
      return json({ok: false, error: 'Failed to find or create user'}, {status: 500});
    }

    // Set userId in session
    session.set('userId', user.id);

    // Clear OTP from session
    session.unset('otp');
    session.unset('otpExpiry');
    session.unset('otpEmail');
    session.unset('otpPhone');

    return json(
      {ok: true, isNewUser},
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return json({ok: false, error: 'Something went wrong'}, {status: 500});
  }
}

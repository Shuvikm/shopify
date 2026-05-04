# 🚀 Deployment & Launch Checklist

> **Time to Production**: 30-60 minutes
> **Status**: Step-by-step guide for going live

---

## ✅ Pre-Launch Phase (24 hours before)

### 1. Environment Setup
```bash
# Create .env.local with ALL variables
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=xxxx
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=xxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx (optional)
STRIPE_SECRET_KEY=sk_live_xxxx (optional)
PUBLIC_CHECKOUT_DOMAIN=https://yourdomain.com
PUBLIC_STORE_DOMAIN=https://yourdomain.com
```

### 2. Shopify Configuration
- [ ] Store created and configured
- [ ] Domain connected
- [ ] SSL certificate verified
- [ ] Shopify admin access tested
- [ ] API credentials generated
- [ ] Webhooks configured (optional)

### 3. Products Setup
- [ ] 10+ products created in Shopify
- [ ] Product images uploaded (high quality)
- [ ] Variants configured (size, color, etc.)
- [ ] Collections created
- [ ] Product descriptions written (SEO-friendly)
- [ ] Pricing set
- [ ] Inventory amounts set

### 4. Payment Gateway
- [ ] Razorpay account created
- [ ] API keys generated
- [ ] Test mode activated
- [ ] HMAC verification enabled
- [ ] Webhook endpoints configured
- [ ] Test transactions completed

### 5. Shipping & Tax
- [ ] Shipping zones configured
- [ ] Shipping rates set
- [ ] Tax rates configured (by region)
- [ ] Free shipping threshold set ($50+)

### 6. Code Quality
```bash
# Run type check
npm run typecheck

# Run lint
npm run lint

# Build production
npm run build
```
- [ ] No TypeScript errors
- [ ] No lint warnings
- [ ] Build completes without errors

### 7. Performance Testing
```bash
# Test load time
npm run preview

# Use PageSpeed Insights
https://pagespeed.web.dev
```
- [ ] Page load < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile score > 85
- [ ] Core Web Vitals green

### 8. Security Check
- [ ] SSL certificate installed
- [ ] CORS headers configured
- [ ] API rate limiting enabled
- [ ] Security headers set
- [ ] GDPR privacy policy added
- [ ] Terms & conditions added
- [ ] Return policy documented

### 9. Analytics Setup
- [ ] Google Analytics 4 configured
- [ ] Conversion tracking enabled
- [ ] Event tracking verified
- [ ] Custom events defined
- [ ] Goals set up

### 10. Email Setup
- [ ] Newsletter service connected (Klaviyo/Mailchimp)
- [ ] Welcome email configured
- [ ] Abandoned cart email ready
- [ ] Order confirmation template set
- [ ] Email verification tested

---

## 🏗️ Build Phase (5-10 minutes)

### Production Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Expected output:
# ✓ Hydrogen build complete
# ✓ Assets bundled
# ✓ Routes optimized
```

### Verify Build
```bash
# Check build artifacts
ls -la dist/

# Test production build locally
npm run preview
# Opens http://localhost:3000
```

### Build Artifacts Checklist
- [ ] `dist/` directory created
- [ ] Server bundle generated
- [ ] Client bundle generated
- [ ] All assets optimized
- [ ] Source maps created (optional)

---

## 🌐 Deployment Phase (10-15 minutes)

### Deploy to Netlify

#### Option 1: Git Push (Recommended)
```bash
# Connect GitHub repo to Netlify
# Set environment variables in Netlify dashboard
# Trigger deploy with git push

git add .
git commit -m "Production ready"
git push origin main
```

#### Option 2: CLI Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Netlify Configuration
- [ ] GitHub repository connected
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist/`
- [ ] Environment variables added
- [ ] Custom domain configured
- [ ] SSL certificate provisioned
- [ ] Redirects configured (if needed)

### Deploy to Vercel (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔗 Post-Deployment (5 minutes)

### 1. Verify Deployment
```bash
# Test production URL
https://yourdomain.com

# Check homepage loads
# Verify all pages accessible
# Test navigation
```

### 2. Test Critical Flows
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Product pages display
- [ ] Add to cart works
- [ ] Checkout process complete
- [ ] Payment processes
- [ ] Order confirmation shown
- [ ] Email received
- [ ] Newsletter signup works

### 3. Update DNS
1. Go to domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS records to point to deployment
3. Wait for DNS propagation (24-48 hours)

### 4. Monitoring Setup
- [ ] Uptime monitoring enabled
- [ ] Error tracking configured
- [ ] Performance monitoring started
- [ ] Analytics data flowing
- [ ] Slack alerts set up

### 5. Domain Verification
```bash
# Verify DNS propagation
nslookup yourdomain.com

# Check SSL certificate
https://yourdomain.com
# Look for green lock icon
```

---

## 📊 Post-Launch Phase (First Week)

### Day 1: Verification
- [ ] Site fully accessible
- [ ] No 404 errors
- [ ] Analytics tracking
- [ ] Payment processing
- [ ] Emails sending
- [ ] Mobile responsive
- [ ] Performance metrics normal

### Day 2: Optimization
- [ ] Monitor analytics
- [ ] Check error logs
- [ ] Review payment success rate
- [ ] Check email deliverability
- [ ] Test mobile experience
- [ ] Verify SEO meta tags

### Day 3-7: Monitoring
- [ ] Track conversion rate
- [ ] Monitor page performance
- [ ] Check customer support tickets
- [ ] Review analytics trends
- [ ] Plan A/B tests
- [ ] Scale marketing efforts

### Metrics to Monitor
```
Daily Dashboard:
- Traffic (sessions, users)
- Conversion rate
- Average order value
- Revenue
- Cart abandonment rate
- Page load time
- Error rate
- Mobile traffic %
```

---

## 🐛 Troubleshooting Common Issues

### Issue: DNS Not Resolving
**Solution**:
1. Verify DNS records in registrar
2. Check nameserver configuration
3. Wait up to 48 hours for propagation
4. Use `nslookup yourdomain.com` to check

### Issue: SSL Certificate Error
**Solution**:
1. Ensure HTTPS is enabled
2. Clear browser cache
3. Wait for certificate provisioning (5 min)
4. Refresh page

### Issue: Payment Not Processing
**Solution**:
1. Verify Razorpay API keys
2. Check test mode is disabled
3. Review payment logs
4. Test with test keys first

### Issue: Images Not Loading
**Solution**:
1. Check Shopify image URLs
2. Verify CORS headers
3. Check CDN configuration
4. Verify image paths in code

### Issue: Slow Page Load
**Solution**:
1. Check build optimization
2. Review image sizes
3. Check network tab
4. Use PageSpeed Insights

---

## 📞 Launch Checklist Summary

### Before Launch (Week 1)
- [ ] All code committed and pushed
- [ ] Environment variables configured
- [ ] Build test successful
- [ ] Performance verified
- [ ] Security review passed
- [ ] Analytics setup complete
- [ ] Payment testing done
- [ ] Email setup verified

### Launch Day
- [ ] Final build created
- [ ] Deploy to production
- [ ] Verify all pages load
- [ ] Test critical flows
- [ ] Monitor dashboard
- [ ] Check error logs
- [ ] Notify team

### Post-Launch (Week 2)
- [ ] Monitor analytics
- [ ] Collect user feedback
- [ ] Fix any critical bugs
- [ ] Optimize based on data
- [ ] Plan A/B tests
- [ ] Scale marketing

---

## 📈 Key Metrics to Track

### Revenue Metrics
- **Conversion Rate** (goal: 2-3%)
- **Average Order Value** (goal: $75+)
- **Revenue per Session** (goal: $2+)
- **Customer Lifetime Value** (goal: $500+)

### Performance Metrics
- **Page Load Time** (goal: < 2.5s)
- **Bounce Rate** (goal: < 50%)
- **Time on Site** (goal: > 2 min)
- **Return Visitor Rate** (goal: > 20%)

### Marketing Metrics
- **Cost per Acquisition** (goal: < $30)
- **Return on Ad Spend** (goal: 3:1+)
- **Email Open Rate** (goal: > 25%)
- **Email Click Rate** (goal: > 3%)

---

## 🚀 Production Rollback Plan

If something goes wrong:

### 1. Quick Rollback
```bash
# Rollback to previous deploy
netlify deploy --prod --from latest

# Or redeploy from GitHub
# Netlify will auto-rollback
```

### 2. Manual Rollback
```bash
# Deploy previous commit
git checkout HEAD~1
npm run build
npm run deploy
```

### 3. Notify Stakeholders
- [ ] Send status update
- [ ] Provide ETA for fix
- [ ] Keep communication frequent
- [ ] Document what failed

---

## 📋 Launch Communication

### Team Announcement
```
Subject: 🚀 Store Launching Today

Hi team,

We're launching the production store today at 2 PM EST.

Timeline:
- 1:30 PM: Final checks
- 2:00 PM: Deploy
- 2:15 PM: Verification
- 2:30 PM: Go live

Monitoring:
- Real-time dashboard: [link]
- Error tracking: [link]
- Contact: [slack channel]
```

### Customer Announcement (Optional)
```
Subject: 🎉 We're Live!

We're excited to announce our new store is live!

Visit us: https://yourdomain.com

Special Launch Offer: Use code LAUNCH10 for 10% off
```

---

## ✅ Final Verification Checklist

```
BEFORE HITTING DEPLOY:

[ ] All environment variables set
[ ] No console errors
[ ] No TypeScript errors
[ ] Build completes successfully
[ ] All links working
[ ] Forms functional
[ ] Payment gateway tested
[ ] Mobile responsive
[ ] SEO meta tags present
[ ] Analytics configured
[ ] Performance acceptable
[ ] Security headers set
[ ] SSL certificate ready
[ ] DNS configured
[ ] Email service working
[ ] Backup plan documented

HITTING DEPLOY... 🚀
```

---

**Deployment Time**: ~30-60 minutes
**Go-Live Time**: < 5 minutes
**Rollback Time**: < 2 minutes (if needed)

**Good luck! 🎉**

export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    quota: 10,
    maxSize: '4MB',
    pagesPerPDF: 5,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: '',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 50,
    maxSize: '16MB',
    pagesPerPDF: 15,
    price: {
      amount: 14,
      priceIds: {
        test: 'price_1OAURYA0KskJspqYXoU5b7xn',
        production: '',
      },
    },
  },
]

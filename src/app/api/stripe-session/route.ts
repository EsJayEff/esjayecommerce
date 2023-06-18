import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export async function POST(req: any, res: NextResponse) {
  const { lineItems } = await req.json();
 
 
  const lineItems1 = lineItems.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: item.price*100,
      product_data: {
        name: item.name,
        description: item.description,
        images: [item.images],
        metadata:{},
      },
    },
    quantity: item.quantity,
  }));
 


  const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'your deployed url';

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        shipping_options: [
          { shipping_rate: 'shr_1NF2CcHunJ5omjzMbYoJd2fY' },
          ],
        line_items: lineItems1,
        success_url: redirectURL + '/payment/success',
        cancel_url: redirectURL + '/payment/fail',
        metadata: {
          name:"some additional info",
          task:"Usman created a task"
        },
      });
      return NextResponse.json(session?.id) ;
}


import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});


export  async function POST(req: any, res: NextResponse){
    const {item}= await req.json();
    const transformedItem = {
         price_data: {
          currency: 'usd',
          unit_amount: item.price * 100,
          product_data:{
            name: item.name,
            description: item.description,
            images:[item.image],
            metadata:{},
          },
        },
      quantity: item.quantity,
     };

      
      const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'your deployed url';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_options: [
          { shipping_rate: 'shr_1NF2CcHunJ5omjzMbYoJd2fY' },
          ],
        line_items: [transformedItem],
        mode: 'payment',
        success_url: redirectURL + '/payment/success',
        cancel_url: redirectURL + '/payment/fail',
        metadata: {
          images: item.image,
          name:"some additional info",
          task:"Usman created a task"
        },
      });

      return NextResponse.json(session?.id) ;
  };

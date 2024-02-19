import { clerkClient } from '@clerk/nextjs';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { createUser, deleteUser, updateUser } from '@/features/user/actions';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;

    const userData = {
      clerkId: id!,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    const user = await createUser(userData);

    if (user) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: user.id,
          creditBalance: user.creditBalance,
        },
      });
    }

    return NextResponse.json({
      message: 'User successfully created',
      status: 201,
      data: user,
    });
  }

  if (eventType === 'user.updated') {
    const { id, last_name, first_name, username, image_url } = evt.data;

    const userData = {
      clerkId: id,
      data: {
        username: username!,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      },
    };

    const user = await updateUser(userData);

    return NextResponse.json({
      message: 'User successfully updated',
      status: 200,
      data: user,
    });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    const user = await deleteUser(id!);

    return NextResponse.json({
      message: 'User successfully deleted',
      status: 200,
      data: user,
    });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  return new Response('', { status: 200 });
}

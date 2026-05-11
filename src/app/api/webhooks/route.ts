import { usersApi } from '@/lib/api'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        console.log('Received webhook request' + req)
        const evt = await verifyWebhook(req)

        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data
        const eventType = evt.type
        console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
        if (evt.type === 'user.created') {
            console.log('userId:', evt.data.id)
            await usersApi.create({
                clerkId: evt.data.id,
                firstName: evt.data.first_name,
                lastName: evt.data.last_name,
                email: evt.data.email_addresses[0]?.email_address || "",
            })
        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}
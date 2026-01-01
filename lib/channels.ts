import { supabase } from './supabase';
import { processConversation } from './gemini';
import { ChatHistoryItem } from './types';

export type ChannelType = 'whatsapp' | 'instagram' | 'messenger';

export interface IncomingMessage {
    channelType: ChannelType;
    senderId: string; // phone number or user ID
    senderName?: string;
    text?: string;
    mediaId?: string;
    mediaType?: string;
    timestamp: Date;
    rawPayload?: any;
}

export interface OutgoingMessage {
    channelType: ChannelType;
    recipientId: string;
    text: string;
}

/**
 * Parse incoming message from any channel into unified format
 */
export function parseIncomingMessage(channelType: ChannelType, payload: any): IncomingMessage | null {
    try {
        switch (channelType) {
            case 'whatsapp':
                const waMessage = payload.messages?.[0];
                const waContact = payload.contacts?.[0];
                return {
                    channelType,
                    senderId: waMessage?.from,
                    senderName: waContact?.profile?.name,
                    text: waMessage?.text?.body,
                    mediaId: waMessage?.voice?.id || waMessage?.image?.id,
                    mediaType: waMessage?.type,
                    timestamp: new Date(),
                    rawPayload: payload
                };

            case 'instagram':
            case 'messenger':
                // Meta Graph API format (shared between IG and Messenger)
                const entry = payload.entry?.[0];
                const messaging = entry?.messaging?.[0];
                return {
                    channelType,
                    senderId: messaging?.sender?.id,
                    senderName: undefined, // Need separate API call for name
                    text: messaging?.message?.text,
                    mediaId: messaging?.message?.attachments?.[0]?.payload?.url,
                    mediaType: messaging?.message?.attachments?.[0]?.type,
                    timestamp: new Date(messaging?.timestamp || Date.now()),
                    rawPayload: payload
                };

            default:
                return null;
        }
    } catch (error) {
        console.error(`[Channel] Error parsing ${channelType} message:`, error);
        return null;
    }
}

/**
 * Send message to any channel
 */
export async function sendMessage(message: OutgoingMessage): Promise<boolean> {
    try {
        switch (message.channelType) {
            case 'whatsapp':
                // 360dialog API
                console.log(`[WhatsApp] Sending to ${message.recipientId}: ${message.text}`);
                // In production: POST to https://waba.360dialog.io/v1/messages
                return true;

            case 'instagram':
            case 'messenger':
                // Meta Graph API
                const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
                if (!accessToken) {
                    console.error('[Meta] Missing PAGE_ACCESS_TOKEN');
                    return false;
                }

                const response = await fetch(
                    `https://graph.facebook.com/v18.0/me/messages?access_token=${accessToken}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            recipient: { id: message.recipientId },
                            message: { text: message.text }
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error(`Meta API error: ${response.status}`);
                }

                console.log(`[${message.channelType}] Sent to ${message.recipientId}`);
                return true;

            default:
                return false;
        }
    } catch (error) {
        console.error(`[Channel] Error sending ${message.channelType} message:`, error);
        return false;
    }
}

/**
 * Get channel configuration for a tenant
 */
export async function getChannelConfig(tenantId: string, channelType: ChannelType) {
    const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('channel_type', channelType)
        .single();

    if (error) {
        console.error('[Channel] Config not found:', error);
        return null;
    }

    return data;
}

/**
 * Unified message processing for all channels
 */
export async function processChannelMessage(
    tenantId: string,
    leadId: string,
    conversationId: string,
    message: IncomingMessage,
    history: ChatHistoryItem[],
    botSettings: any
) {
    // Process with Gemini AI
    const aiResponse = await processConversation(
        history,
        message.text || '[Media Message]',
        botSettings?.business_context || 'VirtualTwin Sovereign AI'
    );

    // Send reply via the same channel
    if (aiResponse.reply) {
        await sendMessage({
            channelType: message.channelType,
            recipientId: message.senderId,
            text: aiResponse.reply
        });
    }

    return aiResponse;
}

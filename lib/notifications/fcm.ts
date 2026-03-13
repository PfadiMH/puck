import { env } from "@lib/env";
import {
  type App,
  getApps,
  initializeApp,
  cert,
} from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Lazy-initialized Firebase Admin App
let firebaseApp: App | null = null;
let initAttempted = false;

function isConfigured(): boolean {
  return !!(
    env.FIREBASE_PROJECT_ID &&
    env.FIREBASE_CLIENT_EMAIL &&
    env.FIREBASE_PRIVATE_KEY
  );
}

function getApp(): App | null {
  if (initAttempted) return firebaseApp;
  initAttempted = true;

  if (!isConfigured()) {
    console.log(
      "Firebase not configured (missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY). Push notifications disabled."
    );
    return null;
  }

  try {
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
    } else {
      firebaseApp = initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          // Firebase private key comes with escaped newlines in env vars
          privateKey: env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
      });
    }

    console.log("Firebase Admin SDK initialized");
    return firebaseApp;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    return null;
  }
}

/**
 * Send a push notification to an FCM topic.
 */
export async function sendToTopic(
  topic: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  const app = getApp();
  if (!app) return false;

  try {
    const messaging = getMessaging(app);

    await messaging.send({
      topic,
      notification: { title, body },
      data: data || {},
      android: {
        priority: "high",
        notification: { channelId: "default" },
      },
      apns: {
        payload: {
          aps: { sound: "default", badge: 1 },
        },
      },
    });

    console.log(`FCM sent to topic "${topic}": ${title}`);
    return true;
  } catch (error) {
    console.error(`FCM send to topic "${topic}" failed:`, error);
    return false;
  }
}

/**
 * Send a push notification to multiple group topics.
 */
export async function sendToGroups(
  groupSlugs: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  if (!isConfigured()) return;

  const topics = new Set<string>();

  for (const slug of groupSlugs) {
    topics.add(slug);
  }

  // Also send to "general" topic
  topics.add("general");

  await Promise.allSettled(
    [...topics].map((topic) => sendToTopic(topic, title, body, data))
  );
}

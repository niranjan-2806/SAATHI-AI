import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Smart chat proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, profile, chatLang } = req.body;

      if (!message || !profile) {
        return res.status(400).json({ error: "Missing message or profile data" });
      }

      const activeGoals = profile.goals || [];
      const activeBadges = profile.badges || [];
      const activeActions = profile.actions || [];
      const recentTransactions = profile.transactions || [];
      const activePolicies = profile.policies || [];

      const systemInstruction = `You are "Saarthi" (or "सारथी" / "சாரதி" / "సారథి" depending on language), an intelligent, polite, and respectful AI financial copilot for the State Bank of India (SBI), built into the YONO SBI banking app.
Your tone should be helpful, culturally respectful (using polite suffixes like "ji" for senior citizens, "Kabir" for students, "Priyanka" or "Priyanka ji" for professionals, etc.), and highly professional.

You have access to the user's real SBI profile information, which you MUST use to answer any questions realistically. Never make up balances or account details—always read them from the profile:
- Customer Name: ${profile.name}
- Account Number: ${profile.accountNo}
- Branch: ${profile.branch}
- Current Account Balance: ₹${profile.balance}
- Financial Health Score: ${profile.financialScore}/100
- Score Explanation: ${profile.scoreExplanation}
- Health Breakdown (Income, Expenses, Savings, Debt):
  - Monthly Income: ₹${profile.healthBreakdown?.income || 0}
  - Monthly Expenses: ₹${profile.healthBreakdown?.expenses || 0}
  - Monthly Savings: ₹${profile.healthBreakdown?.savings || 0}
  - Monthly Debt: ₹${profile.healthBreakdown?.debt || 0}
- Active Goals:
  ${activeGoals.map((g: any) => `- ${g.name}: Target ₹${g.target}, Current saved ₹${g.current}, Deadline: ${g.deadline}`).join('\n') || 'None'}
- Earned Badges:
  ${activeBadges.map((b: any) => `- ${b.name}: ${b.description} (${b.completed ? 'Earned' : 'Locked'})`).join('\n') || 'None'}
- Recommended Next Best Actions:
  ${activeActions.map((a: any) => `- ${a.title}: ${a.description} (Why: ${a.whyReason})`).join('\n') || 'None'}
- Recent Transactions:
  ${recentTransactions.map((t: any) => `- ${t.date}: ${t.description} - ${t.type === 'credit' ? '+' : '-'}₹${t.amount} [Category: ${t.category}]`).join('\n') || 'None'}
- Active Insurance Policies:
  ${activePolicies.map((p: any) => `- ${p.name}: ${p.type} cover of ₹${p.coverage}, premium ₹${p.premium}/mo, status: ${p.status}`).join('\n') || 'None'}

Guidelines:
1. When asked about balance, goals, transactions, insurance, or general profile status, provide precise and realistic information based on the details above.
2. Always reply in the requested language: "${chatLang}" (English ('en'), Hindi ('hi'), Tamil ('ta'), or Telugu ('te')). If the language is Hindi, Tamil, or Telugu, write the entire response in that language using its native script.
3. Be supportive and proactive. For example:
   - If the user is a student (Kabir Mehta), be a friendly "financial buddy", use high-energy, encouraging phrases, suggest micro-SIPs, or UPI roundups.
   - If the user is a working professional (Priyanka Iyer), be premium, efficient, and analytical (tax-saving ELSS schemes under Section 80C, FD booking, emergency funds).
   - If the user is a senior citizen (Ramesh Kumar Prasad), be deeply respectful (use "Pranam Ramesh Kumar ji" or "Ramesh ji"), guide them patiently, reassure them about security, and remind them that SBI never asks for CVV/OTP.
4. If the user asks about security or safety (e.g. "Is my account safe?", "Fraud concerns", "Any unusual transactions"), reassure them that YONO SBI is 100% secure, and refer to their active security actions, recent unusual login detections, or safety checkups if available in their profile.
5. If they say "yes" to connecting with a branch agent, schedule a call back and confirm politely.
6. Keep responses extremely elegant, concise, and direct. Do not write more than 1 to 3 short sentences unless specifically requested to list transactions. Use standard formatting like bold text for values (e.g. **₹${profile.balance}**).
7. CRITICAL: If the user sends a greeting (like "hi", "hello", "hey", "नमस्ते", "வணக்கம்", "నమస్కారం", "yes"), do NOT write long summaries of their account or offer details unless they specifically asked. Just respond with a very short, polite 1-sentence greeting asking how you can help them. Only provide information that they explicitly ask for! Do not be overly talkative.`;

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not configured in the environment.");
        return res.json({ reply: null }); // Trigger client-side local fallback
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("Error in /api/chat endpoint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve static assets / Vite development server middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

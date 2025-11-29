import { Business } from '@/contexts/BusinessContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BusinessInsight {
  category: string;
  insight: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

// Predefined questions Soma B asks to gather business information
const businessQuestions = [
  "Sawubona! I'm Soma B, your business advisor. 🔥 What type of food does your business specialize in?",
  "Eish, that sounds delicious! How long have you been running this business?",
  "Nice one! What's your average number of customers per day?",
  "Sharp sharp! What are your busiest days of the week?",
  "Cool! What's your biggest challenge right now in running the business?",
  "I hear you. What are your goals for the next 6 months?",
  "Yebo! Do you use social media to promote your business? Which platforms?",
  "Last question - what's your price range compared to competitors? (lower/similar/higher)",
];

export class SomaBChatbotService {
  private questionIndex: number = 0;
  private businessData: Record<string, string> = {};

  constructor(existingData?: Record<string, string>, questionIndex?: number) {
    if (existingData) {
      this.businessData = existingData;
    }
    if (questionIndex !== undefined) {
      this.questionIndex = questionIndex;
    }
  }

  // Get the next question from Soma B
  getNextQuestion(): string | null {
    if (this.questionIndex >= businessQuestions.length) {
      return null; // All questions asked
    }
    return businessQuestions[this.questionIndex];
  }

  // Process user's answer and move to next question
  processAnswer(answer: string): { nextQuestion: string | null; isComplete: boolean } {
    // Store the answer
    this.businessData[`question_${this.questionIndex}`] = answer;
    this.questionIndex++;

    const nextQuestion = this.getNextQuestion();
    const isComplete = nextQuestion === null;

    return { nextQuestion, isComplete };
  }

  // Generate business insights based on collected data
  generateInsights(business: Business): BusinessInsight[] {
    const insights: BusinessInsight[] = [];

    // Analyze menu items
    if (business.menu.length === 0) {
      insights.push({
        category: 'Menu',
        insight: 'Your menu is empty',
        recommendation: 'Add at least 5-10 popular dishes to attract customers. Include prices and mouth-watering descriptions!',
        priority: 'high',
      });
    } else if (business.menu.length < 5) {
      insights.push({
        category: 'Menu',
        insight: `You only have ${business.menu.length} items on your menu`,
        recommendation: 'Consider expanding your menu to give customers more choices. Aim for 8-12 items.',
        priority: 'medium',
      });
    }

    // Analyze business hours
    if (business.hours.length === 0) {
      insights.push({
        category: 'Operating Hours',
        insight: 'No business hours set',
        recommendation: 'Set your operating hours so customers know when to visit. This builds trust!',
        priority: 'high',
      });
    }

    // Analyze orders
    if (business.totalOrders === 0) {
      insights.push({
        category: 'Sales',
        insight: 'No orders recorded yet',
        recommendation: 'Promote your business on social media and in your community. Consider offering a launch special!',
        priority: 'high',
      });
    } else if (business.totalOrders < 10) {
      insights.push({
        category: 'Sales',
        insight: 'You\'re just getting started with orders',
        recommendation: 'Keep the momentum! Ask satisfied customers to spread the word and leave reviews.',
        priority: 'medium',
      });
    }

    // Analyze media presence
    if (business.media.length === 0) {
      insights.push({
        category: 'Marketing',
        insight: 'No photos of your food or business',
        recommendation: 'Upload high-quality photos! People eat with their eyes first. Show off your delicious food! 📸',
        priority: 'high',
      });
    }

    // Analyze blog/content
    if (business.blog.length === 0) {
      insights.push({
        category: 'Content',
        insight: 'No blog posts or stories shared',
        recommendation: 'Share your story! Post about daily specials, behind-the-scenes, or customer favorites.',
        priority: 'low',
      });
    }

    // Analyze based on collected chat data
    const challenges = this.businessData['question_4'];
    if (challenges && challenges.toLowerCase().includes('customer')) {
      insights.push({
        category: 'Customer Acquisition',
        insight: 'You mentioned challenges with customers',
        recommendation: 'Try partnering with local events, offer loyalty rewards, or run social media promotions.',
        priority: 'high',
      });
    }

    return insights;
  }

  // Get current state for persistence
  getState() {
    return {
      questionIndex: this.questionIndex,
      businessData: this.businessData,
    };
  }

  // Check if questionnaire is complete
  isQuestionnaireComplete(): boolean {
    return this.questionIndex >= businessQuestions.length;
  }
}


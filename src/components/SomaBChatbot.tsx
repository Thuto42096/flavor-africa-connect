import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { SomaBChatbotService, ChatMessage, BusinessInsight } from '@/services/somaBChatbotService';
import { toast } from 'sonner';

const SomaBChatbot = () => {
  const { business } = useBusiness();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatService, setChatService] = useState<SomaBChatbotService | null>(null);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot
  useEffect(() => {
    const service = new SomaBChatbotService();
    setChatService(service);

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: service.getNextQuestion() || 'Hello!',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatService) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { nextQuestion, isComplete } = chatService.processAnswer(inputValue);

      if (isComplete) {
        // Generate insights
        if (business) {
          const generatedInsights = chatService.generateInsights(business);
          setInsights(generatedInsights);
          setShowInsights(true);

          const completionMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content:
              "Yebo! 🎉 I've analyzed your business and generated some custom insights for you. Check them out below!",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, completionMessage]);
        }
      } else if (nextQuestion) {
        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: nextQuestion,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Soma B - Your Business Advisor
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Answer a few questions and get personalized insights for your business! 🔥
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Area */}
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">Soma B is typing...</p>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          {!showInsights && (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={isTyping || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Insights */}
      {showInsights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Custom Business Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {insight.category}
                    </h4>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{insight.insight}</p>
                  <p className="text-sm font-medium">💡 {insight.recommendation}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SomaBChatbot;


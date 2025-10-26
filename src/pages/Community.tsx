import { MessageSquare, Users, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Community = () => {
  const discussions = [
    {
      id: 1,
      title: "Best practices for food photography on a budget",
      author: "Amaka O.",
      replies: 23,
      category: "Marketing",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "How do I handle negative reviews professionally?",
      author: "John M.",
      replies: 15,
      category: "Customer Service",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "Sharing my journey from street vendor to restaurant owner",
      author: "Sarah K.",
      replies: 45,
      category: "Success Stories",
      time: "1 day ago",
    },
    {
      id: 4,
      title: "Looking for suppliers in Lagos area",
      author: "David A.",
      replies: 8,
      category: "Resources",
      time: "1 day ago",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Members", value: "3,500+" },
    { icon: MessageSquare, label: "Discussions", value: "1,200+" },
    { icon: TrendingUp, label: "Success Stories", value: "450+" },
    { icon: Award, label: "Expert Contributors", value: "120+" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-secondary/10 to-primary/10">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Community <span className="text-primary">Forum</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect, learn, and grow with fellow food entrepreneurs across Africa
            </p>
            <Button size="lg">Join the Conversation</Button>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Discussions */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Recent Discussions</h2>
                  <Button>New Discussion</Button>
                </div>

                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {discussion.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold hover:text-primary transition-colors">
                                  {discussion.title}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>{discussion.author}</span>
                                  <span>•</span>
                                  <span>{discussion.time}</span>
                                </div>
                              </div>
                              <Badge variant="outline">{discussion.category}</Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{discussion.replies} replies</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      Marketing & Branding
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Business Growth
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Customer Service
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Success Stories
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Resources & Tools
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold">Need Expert Help?</h3>
                    <p className="text-sm text-white/90">
                      Connect with business consultants and marketing experts who specialize in helping local food businesses grow.
                    </p>
                    <Button variant="secondary" className="w-full">
                      Get Expert Advice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Community;

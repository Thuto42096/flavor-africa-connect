import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "10 Ways to Market Your Food Business on a Budget",
      excerpt: "Learn cost-effective marketing strategies that can help your small food business reach more customers without breaking the bank.",
      category: "Marketing",
      author: "Sarah Johnson",
      date: "Mar 15, 2024",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "From Street Food to Online Success: A Vendor's Journey",
      excerpt: "Inspiring story of how a local street food vendor tripled their business by going digital with TasteLocal.",
      category: "Success Stories",
      author: "Michael Chen",
      date: "Mar 12, 2024",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "SEO Basics for Restaurant Owners",
      excerpt: "Simple SEO techniques that can help your restaurant appear in local search results and attract more customers.",
      category: "SEO",
      author: "Emma Williams",
      date: "Mar 10, 2024",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Creating an Irresistible Food Menu Online",
      excerpt: "Best practices for photographing and describing your dishes to make them appealing to online customers.",
      category: "Branding",
      author: "David Okonkwo",
      date: "Mar 8, 2024",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "Understanding Your Customer Analytics",
      excerpt: "How to use data from your TasteLocal dashboard to make smarter business decisions and grow faster.",
      category: "Analytics",
      author: "Lisa Anderson",
      date: "Mar 5, 2024",
      readTime: "5 min read",
    },
    {
      id: 6,
      title: "Building a Loyal Customer Base",
      excerpt: "Proven strategies for turning first-time visitors into regular customers who love your food.",
      category: "Growth",
      author: "James Mutua",
      date: "Mar 1, 2024",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Local Business Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resources, tips, and success stories to help your food business thrive in the digital age
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                All Articles
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                Marketing
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                SEO
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                Branding
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                Success Stories
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                Analytics
              </Badge>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <Badge className="bg-secondary">{article.category}</Badge>
                    
                    <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <Card>
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold">Stay Updated</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get the latest tips, resources, and success stories delivered to your inbox every week
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                  />
                  <Button>Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;

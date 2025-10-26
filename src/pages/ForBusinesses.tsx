import { CheckCircle, TrendingUp, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import vendorImage from "@/assets/vendor-business.jpg";

const ForBusinesses = () => {
  const benefits = [
    { icon: TrendingUp, title: "Increase Visibility", description: "Reach thousands of local food lovers searching for authentic dining experiences" },
    { icon: Users, title: "Build Your Brand", description: "Create a professional online presence with your menu, photos, and customer reviews" },
    { icon: BookOpen, title: "Learn & Grow", description: "Access free resources on digital marketing, SEO, and business growth strategies" },
  ];

  const features = [
    "Custom business profile with photos and menu",
    "Real-time analytics dashboard",
    "Customer review management",
    "Promotional tools and advertising",
    "Access to business community forum",
    "Free marketing and SEO resources",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Grow Your Food Business Online
                </h1>
                <p className="text-xl text-white/90">
                  Join TasteLocal and connect with customers who love authentic local food. 
                  Get the tools you need to succeed in the digital age.
                </p>
                <Button size="lg" variant="secondary">
                  Get Started Free
                </Button>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={vendorImage}
                  alt="Happy business owner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Why Join TasteLocal?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're more than just a listing platform - we're your partner in growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6 space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
                <p className="text-muted-foreground">
                  Get access to powerful tools designed specifically for local food businesses
                </p>
                
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="mt-6">
                  Register Your Business
                </Button>
              </div>

              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-primary mb-1">87%</div>
                      <p className="text-muted-foreground">Average increase in customer discovery</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-secondary mb-1">5,000+</div>
                      <p className="text-muted-foreground">Active businesses on platform</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-accent mb-1">Free</div>
                      <p className="text-muted-foreground">To get started - no credit card required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <Card className="bg-gradient-to-br from-primary to-secondary text-white border-0">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Join thousands of local businesses already growing with TasteLocal
                </p>
                <Button size="lg" variant="secondary">
                  Create Free Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ForBusinesses;

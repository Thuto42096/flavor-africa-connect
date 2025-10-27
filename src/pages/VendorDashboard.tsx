import { useState } from "react";
import { BarChart3, Eye, TrendingUp, Users, ShoppingCart, UtensilsCrossed, Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrdersManagement from "@/components/OrdersManagement";
import MenuManagement from "@/components/MenuManagement";
import BusinessHoursManagement from "@/components/BusinessHoursManagement";
import NotificationsCenter from "@/components/NotificationsCenter";
import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";

const VendorDashboard = () => {
  const { business } = useBusiness();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { icon: Eye, label: "Profile Views", value: "1,245", change: "+12.5%" },
    { icon: Users, label: "Customer Clicks", value: "342", change: "+8.3%" },
    { icon: TrendingUp, label: "Review Score", value: business?.rating || "4.8", change: "+0.2" },
    { icon: ShoppingCart, label: "Total Orders", value: business?.totalOrders || "0", change: "↑ 3" },
  ];

  const topDishes = business?.menu.slice(0, 3) || [
    { name: "Pap & Vleis", price: "85", available: true },
    { name: "Boerewors Roll", price: "45", available: true },
    { name: "Lamb Chops", price: "120", available: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-muted/30">
        <div className="container py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {business?.name || user?.name || "Mama"}! 🔥</p>
            </div>
            <div className="flex gap-2">
              {business && business.notifications.filter(n => !n.read).length > 0 && (
                <Badge className="bg-red-500">
                  {business.notifications.filter(n => !n.read).length} New
                </Badge>
              )}
              <Button>Edit Profile</Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-secondary font-medium">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="hidden sm:inline">Menu</span>
              </TabsTrigger>
              <TabsTrigger value="hours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Hours</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Charts and Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would appear here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Menu Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topDishes.map((dish, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{dish.name || "Pap & Vleis"}</span>
                          <span className="text-xs text-muted-foreground">R{dish.price || "85"}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrdersManagement />
            </TabsContent>

            {/* Menu Tab */}
            <TabsContent value="menu">
              <MenuManagement />
            </TabsContent>

            {/* Hours Tab */}
            <TabsContent value="hours">
              <BusinessHoursManagement />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <NotificationsCenter />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorDashboard;

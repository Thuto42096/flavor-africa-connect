import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Users, Store, AlertCircle, CheckCircle } from "lucide-react";
import { passwordService } from "@/services/passwordService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'business_owner'>('customer');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate password strength and match
    const validation = passwordService.validatePassword(password, confirmPassword);
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => toast.warning(warning));
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password, phone, userType);
      if (success) {
        toast.success("Yebo! Welcome to the fam! 🎉🔥");
        // Redirect to email verification
        navigate("/verify-email");
      } else {
        toast.error("Haibo! This email is already registered 😬");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Eish! Something went wrong 😬");
      }
      // Don't proceed if there's an error
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Join the Fam! 🔥</CardTitle>
            <CardDescription>
              Create your account and start discovering the best kasi spots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'customer' | 'business_owner')} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Customer</span>
                </TabsTrigger>
                <TabsTrigger value="business_owner" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="hidden sm:inline">Business</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Thabo Mokoena"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="thabo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="071 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordService.getPasswordStrengthPercentage(password) < 40
                              ? 'bg-red-500'
                              : passwordService.getPasswordStrengthPercentage(password) < 60
                              ? 'bg-yellow-500'
                              : passwordService.getPasswordStrengthPercentage(password) < 80
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${passwordService.getPasswordStrengthPercentage(password)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {passwordService.validatePasswordStrength(password).level}
                      </span>
                    </div>
                    {passwordService.validatePasswordStrength(password).feedback.length > 0 && (
                      <div className="text-xs space-y-1">
                        {passwordService.validatePasswordStrength(password).feedback.map((feedback, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="h-3 w-3" />
                            {feedback}
                          </div>
                        ))}
                      </div>
                    )}
                    {passwordService.validatePasswordStrength(password).isValid && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Strong password!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </div>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              By signing up, you agree to support local businesses and keep it 💯
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Register;


'use client' ;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, Heart, Search, Star, User } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-red-100 to-red-200 text-gray-900">
      <main className="flex-1">
        <section className="w-full py-20 px-6">
          <div className="container mx-auto flex flex-col items-center space-y-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tighter lg:text-6xl">Welcome to FoodieGram</h1>
            <p className="max-w-3xl text-lg text-gray-700">Share your favorite recipes and discover delicious new ones on FoodieGram. Join our community of food lovers today!</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:gap-4 sm:space-y-0">
              <Button className="px-8 py-3 bg-red-500 text-white font-semibold rounded-md">Get Started</Button>
              <Button variant="outline" className="px-8 py-3">Learn More</Button>
            </div>
            <img src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s" alt="FoodieGram" className="w-full max-w-2xl rounded-lg shadow-lg mt-10" />
          </div>
        </section>
        <section className="w-full py-20 bg-red-50 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border border-gray-200">
                <CardHeader className="flex flex-col items-center">
                  <User className="h-12 w-12 mb-4" />
                  <CardTitle>Personal Profiles</CardTitle>
                  <CardDescription>Create your personal profile and share your culinary journey.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border border-gray-200">
                <CardHeader className="flex flex-col items-center">
                  <Search className="h-12 w-12 mb-4" />
                  <CardTitle>Recipe Search</CardTitle>
                  <CardDescription>Find new recipes easily with our advanced search tools.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border border-gray-200">
                <CardHeader className="flex flex-col items-center">
                  <Heart className="h-12 w-12 mb-4" />
                  <CardTitle>Favorite & Share</CardTitle>
                  <CardDescription>Save your favorite recipes and share them with friends.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-20 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">User Reviews</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border border-gray-200">
                <CardContent className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs text-gray-500">Food Blogger</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"FoodieGram has completely transformed the way I share my recipes. The community is amazing and I have discovered so many new dishes!"</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Sarah Miller</p>
                      <p className="text-xs text-gray-500">Chef</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"I love how easy it is to find and share recipes on FoodieGram. It's a must-have app for any food enthusiast."</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Michael Johnson</p>
                      <p className="text-xs text-gray-500">Home Cook</p>
                    </div>
                  </div>
                  <p className="text-gray-700">"FoodieGram is fantastic! I have learned so many new recipes and techniques from other users. The community is very supportive."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-20 bg-red-50 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Get Started</h2>
            <p className="mb-6 text-lg text-gray-700">Join FoodieGram today and start sharing your recipes with the world!</p>
            <Button className="px-8 py-3 bg-red-500 text-white font-semibold rounded-md">Sign Up Now</Button>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 bg-red-100">
        <div className="container mx-auto text-center">
          <p className="text-gray-700">&copy; 2023 FoodieGram. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
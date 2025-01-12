import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <NavigationMenu className="bg-transparent hidden md:flex">
          <NavigationMenuList className="bg-transparent">
            <NavigationMenuItem className="mr-2 md:mr-6">
              <Link href="/" className="font-bold text-base md:text-lg hover:text-primary/80 transition-colors">
                CompareModels.ai
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/compare" className="group inline-flex h-9 w-max items-center justify-center rounded-md px-3 md:px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-primary focus:bg-accent/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                Compare Models
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" className="group inline-flex h-9 w-max items-center justify-center rounded-md px-3 md:px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-primary focus:bg-accent/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                Pricing
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center">
          <Link href="/" className="font-bold text-base hover:text-primary/80 transition-colors mr-2">
            CompareModels.ai
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile Navigation Links */}
          <div className="flex md:hidden space-x-1">
            <Link href="/compare" className="px-2 py-1 text-sm rounded-md hover:bg-accent/10 hover:text-primary">
              Compare
            </Link>
            <Link href="/pricing" className="px-2 py-1 text-sm rounded-md hover:bg-accent/10 hover:text-primary">
              Pricing
            </Link>
          </div>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </SignInButton>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
} 
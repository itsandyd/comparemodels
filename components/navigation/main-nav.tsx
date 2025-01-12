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
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-6">
        <NavigationMenu className="bg-transparent">
          <NavigationMenuList className="bg-transparent">
            <NavigationMenuItem className="mr-6">
              <Link href="/" className="font-bold text-lg hover:text-primary/80 transition-colors">
                CompareModels.ai
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/compare" className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-primary focus:bg-accent/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                Compare Models
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-primary focus:bg-accent/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                Pricing
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
} 
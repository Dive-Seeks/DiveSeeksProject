"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Zap, Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: "Software Services", link: "/software-services" },
    { name: "Security", link: "/security" },
    { name: "Funding Solutions", link: "/funding-solutions" },
    { name: "Contact", link: "#contact" },
  ]

  return (
    <ResizableNavbar>
      {/* Desktop Navigation */}
      <NavBody>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2" aria-label="DiveYellow Homepage">
            <Image src="/DiveSeek-logo-Website.svg" alt="DiveYellow Logo" width={100} height={25} priority className="z-10 p-0 m-0 dark:invert" />
          </Link>
        </div>

        <NavItems items={navItems} />

        <div className="flex items-center relative z-[70]">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {/* Request Demo Section */}
            <NavbarButton
              href="#contact"
              variant="dark"
              className="flex items-center gap-3 px-4 py-2 rounded-none border-r border-gray-300 dark:border-gray-600"
            >
              <Zap className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Request Demo</span>
                <span className="text-xs text-gray-400 -mt-0.5">v1.0.0</span>
              </div>
            </NavbarButton>
            
            {/* Theme Toggle Section */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-full w-12 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700 relative z-[80]">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 rounded-xl z-[90]">
                  <DropdownMenuItem onClick={() => { console.log('Desktop: Setting theme to light'); setTheme("light"); }} className="flex items-center gap-2 cursor-pointer">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { console.log('Desktop: Setting theme to dark'); setTheme("dark"); }} className="flex items-center gap-2 cursor-pointer">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { console.log('Desktop: Setting theme to system'); setTheme("system"); }} className="flex items-center gap-2 cursor-pointer">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2" aria-label="DiveYellow Homepage">
              <Image src="/DiveSeek-logo-Website.svg" alt="DiveYellow Homepage" width={100} height={25} priority className="z-10 p-0 m-0 dark:invert" />
            </Link>
          </div>
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="text-lg font-medium transition-colors hover:text-primary text-black dark:text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {/* Request Demo Section */}
              <NavbarButton
                href="#contact"
                variant="dark"
                className="flex-1 flex items-center gap-3 px-4 py-2 rounded-none border-r border-gray-300 dark:border-gray-600"
                onClick={() => setIsOpen(false)}
              >
                <Zap className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Request Demo</span>
                  <span className="text-xs text-gray-400 -mt-0.5">v1.0.0</span>
                </div>
              </NavbarButton>
              
              {/* Theme Toggle Section */}
              {mounted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-full w-12 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 rounded-xl">
                    <DropdownMenuItem onClick={() => { console.log('Mobile: Setting theme to light'); setTheme("light"); }} className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { console.log('Mobile: Setting theme to dark'); setTheme("dark"); }} className="flex items-center gap-2 cursor-pointer">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { console.log('Mobile: Setting theme to system'); setTheme("system"); }} className="flex items-center gap-2 cursor-pointer">
                      <Monitor className="h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  )
}

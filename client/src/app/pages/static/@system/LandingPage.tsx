import { Link } from 'react-router-dom'
import { Button } from '../../components/@system/ui/button'
import { Header } from '../../components/@system/Header/Header'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Product Template</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Built with React + Vite + shadcn/ui
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/app">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

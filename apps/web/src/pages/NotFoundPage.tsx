import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="container text-center max-w-md py-24">
        <div className="font-display font-bold text-forest text-6xl mb-4">404</div>
        <h1 className="font-display font-bold text-ink text-h2 mb-4">Page not found</h1>
        <p className="font-body text-muted mb-8">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">Back to home <ArrowRight size={15} /></Link>
          <Link to="/praxis-in-action" className="btn-outline">Praxis in Action</Link>
        </div>
      </div>
    </div>
  )
}

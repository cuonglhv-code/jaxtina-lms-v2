export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Create Account</h1>
        <p className="text-gray-500">Please contact your administrator to create an account.</p>
        <a href="/login" className="mt-4 block text-blue-600 hover:underline text-sm">
          Back to sign in
        </a>
      </div>
    </div>
  )
}

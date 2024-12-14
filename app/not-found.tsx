import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-center text-white">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-start flex-grow py-52">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 font-bold">
          Oops!
        </h1>
        <h2 className="p-6 font-extrabold tracking-tight text-5xl">
          404 - Page Not Found
        </h2>
        <p>
          It looks like you've stumbled upon a page that doesn't exist.
        </p>
        <Link href="/">
          <div className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 rounded-3xl">
            Go Back Home
          </div>
        </Link>
      </div>
    </div>
  );
}

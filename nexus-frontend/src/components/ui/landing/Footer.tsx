export default function Footer() {
  return (
    <footer className="relative bg-[#142210] py-10 text-center">
      {/* top fade so it blends from CTA */}
      <div className="pointer-events-none absolute top-0 left-0 h-24 w-full bg-gradient-to-b from-transparent to-[#142210]" />

      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-4 flex justify-center gap-6 text-sm font-medium text-gray-400">
          <a className="hover:text-[#46ec13]" href="#">Privacy</a>
          <a className="hover:text-[#46ec13]" href="#">Terms</a>
          <a className="hover:text-[#46ec13]" href="#">Support</a>
        </div>
        <p className="text-xs text-gray-600">© 2023 Nexus Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}








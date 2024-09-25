import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-t-zinc-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Dashmetrics</h3>
            <p className="text-sm text-muted-foreground">
              <a
                href="https://github.com/lycfyi/dashmetrics"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open-source
              </a>{" "}
              alternative to ChartMogul built by{" "}
              <a
                href="https://x.com/lycfyi"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                lycfyi
              </a>
              .
            </p>
          </div>
          <div />
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/lycfyi/dashmetrics/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/lycfyi/dashmetrics/issues"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Report Issues
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}


import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-6 md:py-0">
                <p className="text-center text-sm leading-loose text-slate-500 dark:text-slate-400 md:text-left">
                    Built by{" "}
                    <a
                        href="https://github.com/Cyberking99"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Cyberking99
                    </a>
                    . The source code is available on{" "}
                    <a
                        href="https://github.com/Cyberking99/BitTask"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        GitHub
                    </a>
                    .
                </p>
                <div className="flex gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Link href="/terms" className="hover:underline underline-offset-4">
                        Terms
                    </Link>
                    <Link href="/privacy" className="hover:underline underline-offset-4">
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
}

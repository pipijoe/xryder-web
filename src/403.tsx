/**
 * v0 by Vercel.
 * @see https://v0.dev/t/huCjiFxPnyk
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {Link} from "react-router-dom";
import {Lock} from "lucide-react";

export default function Forbidden() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <Lock className="mx-auto h-12 w-12 text-accent-foreground" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">403 Forbidden</h1>
                <p className="mt-4 text-muted-foreground">
                    Oops, it looks like you don't have permission to access this page. Please check your access rights or contact
                    the site administrator.
                </p>
                <p>
                    糟糕！看起来你没有获得访问该页面的权限。检查一下你的访问权限或者联系网站管理员。
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        返回首页
                    </Link>
                </div>
            </div>
        </div>
    )
}

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Apenas ADMIN pode acessar configurações
    if (path.startsWith("/configuracoes") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Define quais rotas devem ser protegidas pelo middleware
  // Abaixo, estamos protegendo tudo dentro das rotas listadas, exceto recursos estáticos e API de autenticação
  matcher: [
    "/",
    "/dashboard/:path*",
    "/cursos/:path*",
    "/simulados/:path*",
    "/diagnostico/:path*",
    "/analises/:path*",
    "/relatorios/:path*",
    "/configuracoes/:path*",
  ],
};

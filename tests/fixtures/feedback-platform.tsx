// Test-only substitutes for Clerk and Next routing. Never imported by the app.
import { createContext, useContext, useMemo, type ReactNode } from "react";

export const Platform = createContext({
  userId: "browser-user-a", pathname: "/dashboard/copilots/new", search: "edit=42", push: (_path: string) => {},
});
export const useAuth = () => {
  const { userId } = useContext(Platform);
  return { userId, isLoaded: true, isSignedIn: true };
};
export const useUser = () => ({ user: { id: useContext(Platform).userId } });
export const usePathname = () => useContext(Platform).pathname;
export const useRouter = () => {
  const { push } = useContext(Platform);
  return useMemo(() => ({ push, replace: push }), [push]);
};
export const useSearchParams = () => {
  const { search } = useContext(Platform);
  return useMemo(() => new URLSearchParams(search), [search]);
};

export default function TestLink({ children, href, ...props }: { children: ReactNode; href: string }) {
  return <a href={href} {...props}>{children}</a>;
}

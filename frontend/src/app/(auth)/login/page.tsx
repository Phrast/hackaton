"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Leaf, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);
      login(response);
      toast.success("Connexion réussie !");
      router.push("/sites");
    } catch {
      toast.error("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="glass-card w-full max-w-md p-8 relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl bg-primary/20 p-3 mb-3 border border-primary/30">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">CarbonTrack</h1>
          <p className="text-muted-foreground text-sm mt-1">Connexion à votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@capgemini.com"
                className="pl-10 glass border-border"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 glass border-border"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

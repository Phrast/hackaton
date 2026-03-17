"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Leaf, Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/hooks/useAuth";

const schema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await authApi.register(data);
      login(response);
      toast.success("Compte créé avec succès !");
      router.push("/sites");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Erreur lors de l'inscription";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="glass-card w-full max-w-md p-8 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-2xl bg-primary/20 p-3 mb-3 border border-primary/30">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">CarbonTrack</h1>
          <p className="text-muted-foreground text-sm mt-1">Créer votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="firstName" placeholder="Jean" className="pl-10 glass border-border" {...register("firstName")} />
              </div>
              {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" placeholder="Dupont" className="glass border-border" {...register("lastName")} />
              {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="vous@entreprise.com" className="pl-10 glass border-border" {...register("email")} />
            </div>
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="8 caractères minimum" className="pl-10 glass border-border" {...register("password")} />
            </div>
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-semibold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

import { requireUser } from "@/lib/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { SecurityForm } from "@/components/settings/security-form";

export const metadata: Metadata = { title: "Configurações" };

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  github?: string;
}

export default async function SettingsPage() {
  const user = await requireUser();
  const social = (user.socialLinks ?? {}) as SocialLinks;

  return (
    <div className="mx-auto w-full max-w-2xl glass-panel rounded-none lg:rounded-3xl lg:my-6 overflow-hidden">
      <PageHeader title="Configurações" description="Gerencie sua conta e perfil" />

      <div className="p-4 sm:p-5">
        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">
              Perfil
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-1">
              Conta & Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil público</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  user={{
                    name: user.name,
                    username: user.username,
                    bio: user.bio,
                    location: user.location,
                    websiteUrl: user.websiteUrl,
                    image: user.image,
                    bannerUrl: user.bannerUrl,
                    social,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Conta & Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <SecurityForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

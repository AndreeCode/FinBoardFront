'use client';

import { useState } from 'react';
import { Save, Bell, Lock, User, Palette } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { Separator } from '@/src/components/ui/separator';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    currency: 'COP',
    notifications: {
      budgetAlerts: true,
      weeklyReport: true,
      monthlyReport: true,
      newTransactions: false,
    },
    theme: 'light',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground mt-2">
              Personaliza tu experiencia en Mi Finanzas
            </p>
          </div>

          {/* Profile Settings */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Información Personal</CardTitle>
              </div>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                  className="mt-2"
                  maxLength={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notificaciones</CardTitle>
              </div>
              <CardDescription>
                Controla tus preferencias de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Alertas de Presupuesto</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones cuando te acerques al límite de gastos
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.budgetAlerts}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        budgetAlerts: value,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Reporte Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe un resumen semanal de tus gastos
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReport}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        weeklyReport: value,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Reporte Mensual</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe un análisis detallado mensual de tus finanzas
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.monthlyReport}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        monthlyReport: value,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-semibold">Nuevas Transacciones</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones en tiempo real de nuevos gastos
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.newTransactions}
                  onCheckedChange={(value) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        newTransactions: value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Apariencia</CardTitle>
              </div>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="font-semibold">Tema</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecciona el tema de la aplicación
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setSettings({ ...settings, theme: 'light' })
                    }
                  >
                    Claro
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setSettings({ ...settings, theme: 'dark' })
                    }
                  >
                    Oscuro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle>Seguridad</CardTitle>
              </div>
              <CardDescription>
                Administra tu contraseña y seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full md:w-auto bg-transparent">
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
            {isSaved && (
              <span className="text-green-600 font-semibold">
                ✓ Cambios guardados
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

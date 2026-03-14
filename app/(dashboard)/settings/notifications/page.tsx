"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ContentSection } from "../content-section";

export default function SettingsNotificationsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <ContentSection
      title="Notifications"
      desc="Configure how you receive notifications."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Email Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive email about your account activity.
            </p>
          </div>
          <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Push Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in-app.
            </p>
          </div>
          <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Marketing Emails</label>
            <p className="text-sm text-muted-foreground">
              Receive emails about new products, features, and more.
            </p>
          </div>
          <Switch
            checked={marketingEmails}
            onCheckedChange={setMarketingEmails}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Security Alerts</label>
            <p className="text-sm text-muted-foreground">
              Receive alerts about your account security.
            </p>
          </div>
          <Switch
            checked={securityAlerts}
            onCheckedChange={setSecurityAlerts}
          />
        </div>
        <Button
          onClick={() => toast.success("Notification preferences saved")}
        >
          Save preferences
        </Button>
      </div>
    </ContentSection>
  );
}

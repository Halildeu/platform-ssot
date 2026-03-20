/**
 * Form Pattern -- Shows controlled form state management with design-system components.
 *
 * Demonstrates controlled inputs, validation, and submit handling.
 * Can be easily adapted for react-hook-form or other form libraries.
 */
import React, { useState } from "react";

import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Card,
  CardHeader,
  CardBody,
  DesignSystemProvider,
} from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Form state types                                                   */
/* ------------------------------------------------------------------ */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio: string;
  notificationType: string;
  acceptTerms: boolean;
  subscribeNewsletter: boolean;
  enableTwoFactor: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  acceptTerms?: string;
}

const INITIAL_DATA: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  bio: "",
  notificationType: "email",
  acceptTerms: false,
  subscribeNewsletter: true,
  enableTwoFactor: false,
};

const ROLE_OPTIONS = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "qa", label: "QA Engineer" },
  { value: "devops", label: "DevOps" },
];

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.role) {
    errors.role = "Please select a role";
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = "You must accept the terms";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  FormExample                                                        */
/* ------------------------------------------------------------------ */

export function FormExample() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <DesignSystemProvider>
        <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
          <Card variant="elevated">
            <CardHeader title="Form Submitted" subtitle="Registration complete" />
            <CardBody>
              <p style={{ marginBottom: 16 }}>
                Thank you, {formData.firstName}! Your registration has been received.
              </p>
              <pre
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "var(--surface-muted)",
                  fontSize: 12,
                  overflow: "auto",
                }}
              >
                {JSON.stringify(formData, null, 2)}
              </pre>
              <div style={{ marginTop: 16 }}>
                <Button variant="outline" onClick={handleReset}>
                  Submit Another
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </DesignSystemProvider>
    );
  }

  return (
    <DesignSystemProvider>
      <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          User Registration
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Demonstrates controlled form patterns with validation.
        </p>

        <form onSubmit={handleSubmit}>
          <Card variant="elevated">
            <CardBody>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* -- Name fields (side by side) -- */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input
                    label="First Name"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onValueChange={(v) => updateField("firstName", v)}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onValueChange={(v) => updateField("lastName", v)}
                    error={errors.lastName}
                  />
                </div>

                {/* -- Email -- */}
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onValueChange={(v) => updateField("email", v)}
                  error={errors.email}
                  hint="We will never share your email."
                />

                {/* -- Role select -- */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    Role *
                  </label>
                  <Select
                    options={ROLE_OPTIONS}
                    placeholder="Select your role"
                    value={formData.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    error={!!errors.role}
                  />
                  {errors.role && (
                    <span style={{ fontSize: 12, color: "var(--state-error-text)" }}>
                      {errors.role}
                    </span>
                  )}
                </div>

                {/* -- Bio (uncontrolled with defaultValue) -- */}
                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  description="Optional. Max 200 characters."
                  maxLength={200}
                  showCount
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                />

                {/* -- Notification type radio -- */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    Notification Preference
                  </label>
                  <RadioGroup
                    name="notification-type"
                    value={formData.notificationType}
                    onChange={(v) => updateField("notificationType", v)}
                    direction="horizontal"
                  >
                    <Radio value="email" label="Email" />
                    <Radio value="sms" label="SMS" />
                    <Radio value="push" label="Push" />
                    <Radio value="none" label="None" />
                  </RadioGroup>
                </div>

                {/* -- Toggles -- */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    paddingTop: 8,
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <Switch
                    label="Enable two-factor authentication"
                    description="Adds an extra layer of security"
                    checked={formData.enableTwoFactor}
                    onCheckedChange={(v) => updateField("enableTwoFactor", v)}
                  />

                  <Checkbox
                    label="Subscribe to newsletter"
                    description="Receive product updates and tips"
                    checked={formData.subscribeNewsletter}
                    onChange={(e) => updateField("subscribeNewsletter", e.target.checked)}
                  />

                  <div>
                    <Checkbox
                      label="I accept the terms and conditions"
                      checked={formData.acceptTerms}
                      onChange={(e) => updateField("acceptTerms", e.target.checked)}
                      error={!!errors.acceptTerms}
                    />
                    {errors.acceptTerms && (
                      <span style={{ fontSize: 12, color: "var(--state-error-text)", marginLeft: 28 }}>
                        {errors.acceptTerms}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* -- Actions -- */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Button type="button" variant="ghost" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </DesignSystemProvider>
  );
}

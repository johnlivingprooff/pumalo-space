"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ContactHostModal } from "@/components/contact/ContactHostModal";

interface HostContactButtonProps {
  host: {
    id: string;
    name: string;
    avatar: string | null;
    email?: string | null;
    phone?: string | null;
  };
  propertyTitle: string;
}

export function HostContactButton({
  host,
  propertyTitle,
}: HostContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        fullWidth
        onClick={() => setIsModalOpen(true)}
      >
        Contact Host
      </Button>

      <ContactHostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        host={host}
        propertyTitle={propertyTitle}
      />
    </>
  );
}

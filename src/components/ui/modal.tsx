'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: FormModalProps) {
  const sizeClasses = {
    sm: 'sm:max-w-[325px]',
    md: 'sm:max-w-[425px]',
    lg: 'sm:max-w-[575px]',
    xl: 'sm:max-w-[725px]',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-0 h-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
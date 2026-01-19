'use client'

import { useToast } from '@/lib/useToast'
import { ToastContainer } from '@/components/Toast'

export function ToastWrapper() {
  const { toasts, removeToast } = useToast()
  return <ToastContainer toasts={toasts} removeToast={removeToast} />
}
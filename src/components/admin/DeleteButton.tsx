'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ action, disabled }: { action: () => void, disabled?: boolean }) {
  return (
    <form action={() => {
      if (window.confirm('Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.')) {
        action()
      }
    }}>
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  )
}

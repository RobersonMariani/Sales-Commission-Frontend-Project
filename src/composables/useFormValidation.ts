import { ref, type Ref } from 'vue'
import type { ZodType, ZodError } from 'zod/v4'

export function useFormValidation<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  form: Ref<T>,
) {
  const errors = ref<Record<string, string>>({}) as Ref<Record<string, string>>
  const touched = ref<Set<string>>(new Set())

  function validateField(field: string): void {
    touched.value.add(field)
    const result = schema.safeParse(form.value)

    if (result.success) {
      delete errors.value[field]
      return
    }

    const zodError = result.error as ZodError
    const fieldIssue = zodError.issues.find((i) => String(i.path[0]) === field)

    if (fieldIssue) {
      errors.value[field] = fieldIssue.message
    } else {
      delete errors.value[field]
    }
  }

  function validateAll(): boolean {
    errors.value = {}
    const result = schema.safeParse(form.value)

    if (result.success) return true

    const zodError = result.error as ZodError
    for (const issue of zodError.issues) {
      const field = String(issue.path[0])
      if (!errors.value[field]) {
        errors.value[field] = issue.message
      }
      touched.value.add(field)
    }

    return false
  }

  function setApiErrors(apiErrors: Record<string, string[]>): void {
    for (const [field, messages] of Object.entries(apiErrors)) {
      if (messages[0]) {
        errors.value[field] = messages[0]
      }
    }
  }

  function clearErrors(): void {
    errors.value = {}
    touched.value.clear()
  }

  return { errors, touched, validateField, validateAll, setApiErrors, clearErrors }
}

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";

interface FieldWrapperProps {
  label?: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldWrapper({ label, htmlFor, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-mist-200">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mist-500">{hint}</p>
      ) : null}
    </div>
  );
}

const baseFieldClasses =
  "w-full rounded-md border bg-ink-900 px-3.5 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:outline-none focus:ring-1";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, id, required, className = "", containerClassName = "", ...rest }, ref) => {
    const fieldId = id ?? `field-${label?.toLowerCase().replace(/\s+/g, "-") ?? Math.random().toString(36).slice(2)}`;
    return (
      <div className={containerClassName}>
        <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint} required={required}>
          <div className="relative">
            {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-400">{icon}</span>}
            <input
              ref={ref}
              id={fieldId}
              required={required}
              aria-invalid={!!error}
              className={`${baseFieldClasses} ${icon ? "pl-10" : ""} ${
                error ? "border-danger focus:border-danger focus:ring-danger/30" : "border-ink-600 focus:border-signal focus:ring-signal/30"
              } ${className}`}
              {...rest}
            />
          </div>
        </FieldWrapper>
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, required, className = "", ...rest }, ref) => {
    const fieldId = id ?? `field-${label?.toLowerCase().replace(/\s+/g, "-") ?? Math.random().toString(36).slice(2)}`;
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint} required={required}>
        <textarea
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={!!error}
          className={`${baseFieldClasses} resize-y ${
            error ? "border-danger focus:border-danger focus:ring-danger/30" : "border-ink-600 focus:border-signal focus:ring-signal/30"
          } ${className}`}
          {...rest}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, required, className = "", children, ...rest }, ref) => {
    const fieldId = id ?? `field-${label?.toLowerCase().replace(/\s+/g, "-") ?? Math.random().toString(36).slice(2)}`;
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} hint={hint} required={required}>
        <select
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={!!error}
          className={`${baseFieldClasses} appearance-none ${
            error ? "border-danger focus:border-danger focus:ring-danger/30" : "border-ink-600 focus:border-signal focus:ring-signal/30"
          } ${className}`}
          {...rest}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";

/**
 * Form validation, kept out of the component so it can be reasoned about on its own.
 *
 * Deliberately forgiving. Every rejected submission on a contractor site is a lost lead,
 * and the cost of a slightly malformed phone number reaching the office is nil next to the
 * cost of a homeowner with a leak giving up at a red border. So: name and phone are the
 * only hard requirements, email is validated only if supplied, and the phone rule accepts
 * anything with ten or more digits in it.
 */
export type EstimateFields = {
  name: string;
  phone: string;
  email: string;
  address: string;
  topic: string;
  message: string;
};

export type Errors = Partial<Record<keyof EstimateFields, string>>;

const DIGITS = /\d/g;

export function validate(fields: EstimateFields): Errors {
  const errors: Errors = {};

  if (!fields.name.trim()) {
    errors.name = "Please add your name so we know who we are speaking to.";
  }

  const digits = (fields.phone.match(DIGITS) ?? []).length;
  if (!fields.phone.trim()) {
    errors.phone = "A phone number is the fastest way to reach you about a roof.";
  } else if (digits < 10) {
    errors.phone = "That looks a digit or two short — please check the number.";
  }

  // Optional. Only checked when the visitor actually typed something.
  if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) {
    errors.email = "Please check the email address, or leave it blank.";
  }

  return errors;
}

export const EMPTY: EstimateFields = {
  name: "",
  phone: "",
  email: "",
  address: "",
  topic: "",
  message: "",
};

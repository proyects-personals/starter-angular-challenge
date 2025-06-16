import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";

export function validateDateRevisionAfterRelease(
  releaseField: string,
  revisionField: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const release = group.get(releaseField)?.value;
    const revision = group.get(revisionField)?.value;

    if (!release || !revision) return null;

    return new Date(revision) > new Date(release)
      ? null
      : { revisionBeforeRelease: true };
  };
}

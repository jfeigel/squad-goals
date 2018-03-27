import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(ac: AbstractControl) {
    const password = ac.get('password').value;
    const confirm = ac.get('passwordConfirm').value;

    if (password !== confirm) {
      ac.get('passwordConfirm').setErrors({ match: true });
    } else {
      return null;
    }
  }
}

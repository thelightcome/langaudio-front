const DEFAULT_OPTIONS = {
  email: {
    init: "",
    options: {
      required: true,
      isEmail: true,
    },
  },
  password: {
    init: "",
    options: {
      required: true,
      isPassword: true,
    },
  },
  same: {
    init: "",
    options: {
      required: true,
    },
  },
};

const EMAIL_REGEXP = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEXP = /(?=.{8,})/;
// /^(?=^.{8,}$)(?=.*[A-Z])(?=.*[a-z]).*$/g

export type TYPES_DEFAULT_OPTIONS_KEYS = keyof typeof DEFAULT_OPTIONS;

interface IIsSame {
  field?: string;
  value?: any;
}

export interface ISchemesOption {
  required?: boolean;
  isEmail?: boolean | typeof RegExp;
  min?: number;
  max?: number;
  isPassword?: boolean | typeof RegExp;
  isSame?: IIsSame;
  custom?: (value: any) => boolean;
}

export type TypesSchemesOption = keyof ISchemesOption;

export interface IFormFieldOptions extends ISchemesOption {
  type?: TYPES_DEFAULT_OPTIONS_KEYS;
  init?: any;
}

export interface IUseFormHookOption {
  [key: string]: IFormFieldOptions;
}

export type TypeErrorMessages = Partial<{
  [key in TypesSchemesOption]: string;
}>;

export interface IUseFormHookErrorMessages {
  [key: string]: TypeErrorMessages;
}

const DEFAULT_MESSAGES: TypeErrorMessages = {
  required: "This field is required",
  isEmail: "This is incorrect email",
  min: "This value is less than min value",
  max: "This value is more than max value",
  isPassword: "Password's length must be eight characters or longer",
  isSame: "This values not equal",
  custom: "Your custom form not valid",
};

const VALIDATION_SCHEMES = {
  required(v: any, option: boolean): boolean {
    return !!v || !option;
  },
  isEmail(v: string, option: boolean | typeof RegExp): boolean {
    if (!option) return true;
    if (option instanceof RegExp) return option.test(v);
    return EMAIL_REGEXP.test(v);
  },
  min(v: string | number, min: number): boolean {
    if (typeof v === "number") return v >= min;
    return v.length >= min;
  },
  max(v: string | number, max: number): boolean {
    if (typeof v === "number") return v <= max;
    return v.length <= max;
  },
  isPassword(v: string, option: boolean | typeof RegExp): boolean {
    if (!option) return true;
    if (option instanceof RegExp) return option.test(v);
    return PASSWORD_REGEXP.test(v);
  },
  isSame(v: any, _: any, addData: { compare: any }): boolean {
    return deepEqual(v, addData.compare);
  },
  custom(v: any, func: (value: any) => boolean): boolean {
    return func(v);
  },
};

export const VALIDATION_KEYS = Object.keys(
  VALIDATION_SCHEMES
) as TypesSchemesOption[];

function getInitValue(fieldOptions: IFormFieldOptions) {
  if (fieldOptions.type && DEFAULT_OPTIONS[fieldOptions.type]) {
    if (
      fieldOptions.init &&
      typeof fieldOptions.init ===
        typeof DEFAULT_OPTIONS[fieldOptions.type].init
    )
      return fieldOptions.init;
    return DEFAULT_OPTIONS[fieldOptions.type].init;
  }
  return fieldOptions.init;
}

function getOptions(fieldOptions: IFormFieldOptions): ISchemesOption {
  const options: ISchemesOption =
    fieldOptions.type && DEFAULT_OPTIONS[fieldOptions.type]
      ? { ...DEFAULT_OPTIONS[fieldOptions.type].options }
      : {};
  Object.keys(fieldOptions).forEach((key) => {
    if (VALIDATION_SCHEMES[key as TypesSchemesOption]) {
      options[key as TypesSchemesOption] = fieldOptions[
        key as TypesSchemesOption
      ] as any;
    }
  });

  return options;
}

function validate(
  value: any,
  schemes: ISchemesOption,
  messages: TypeErrorMessages,
  compare: any,
  reduceObj?: { [key: string]: Ref<any> }
): string {
  return (Object.keys(schemes) as TypesSchemesOption[])
    .filter((key) => {
      const addData = {
        compare:
          compare ||
          (schemes.isSame?.field &&
            reduceObj &&
            reduceObj[schemes.isSame?.field].value) ||
          schemes.isSame?.value ||
          null,
      };
      // @ts-ignore
      return !VALIDATION_SCHEMES[key](value, schemes[key], addData);
    })
    .reduce((acc: string, key) => {
      return acc + (acc ? " " : "") + messages[key];
    }, "");
}

export function useFieldHook(
  fieldOption: IFormFieldOptions,
  messages?: TypeErrorMessages
) {
  const options = getOptions(fieldOption);

  const initValue = getInitValue(fieldOption);

  const value = ref(initValue);
  const errors = ref("");
  const isValid = computed(() => {
    return !errors.value.length;
  });

  watch(
    () => value.value,
    () => {
      if (errors.value) errors.value = "";
    }
  );

  function check(compare: any = null, reduceObj?: { [key: string]: Ref<any> }) {
    errors.value = validate(
      value.value,
      options,
      Object.assign({}, DEFAULT_MESSAGES, messages || {}),
      compare,
      reduceObj
    );
  }

  function clear() {
    value.value = initValue;
    errors.value = "";
  }

  return {
    value,
    isValid,
    errors,
    check,
    clear,
  };
}

export function useFormHook(
  formOptions: IUseFormHookOption,
  messages?: IUseFormHookErrorMessages,
  callback?: (data: { [key: string]: any }, formEvent?: any) => any
) {
  type TypesKeys = keyof typeof formOptions;

  const fieldNames = Object.keys(formOptions) as TypesKeys[];

  const resultObj = {
    values: {} as { [key in TypesKeys]: Ref<any> },
    isValid: {} as { [key in TypesKeys]: Ref<boolean> },
    errors: {} as { [key in TypesKeys]: Ref<string> },
    check: {} as { [key in TypesKeys]: Function },
    clear: {} as { [key in TypesKeys]: Function },
  };
  const reduceObj = fieldNames.reduce((acc, key) => {
    const { value, isValid, errors, check, clear } = useFieldHook(
      formOptions[key],
      messages ? messages[key] : undefined
    );
    acc.values[key] = value;
    acc.isValid[key] = isValid;
    acc.errors[key] = errors;
    acc.check[key] = check;
    acc.clear[key] = clear;
    return acc;
  }, resultObj);

  const isValid = computed(() => {
    const vals = Object.values(reduceObj.isValid);
    return vals.every((v) => v.value);
  });

  function check(fieldName?: string, compare: any = null) {
    if (fieldName && formOptions[fieldName])
      reduceObj.check[fieldName](compare, reduceObj.values);
    else
      Object.values(reduceObj.check).forEach((func) =>
        func(compare, reduceObj.values)
      );
  }

  function clear() {
    Object.values(reduceObj.clear).forEach((func) => func());
  }

  async function handleSubmit(
    event: any,
    handleClickCallback?: (data: { [key: string]: any }, event?: any) => any
  ) {
    check();
    if (!isValid.value) return;
    const data = unref(reduceObj.values);
    const requestFunc = handleClickCallback || callback || (() => {});
    return await requestFunc(data, event);
  }

  return {
    ...reduceObj,
    isValid,
    check,
    handleSubmit,
    clear,
  };
}

function deepEqual(v1: any, v2: any): boolean {
  if (v1 === v2) return true;
  return false;
}

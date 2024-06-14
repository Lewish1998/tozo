import axios from "axios";
import { FormikHelpers, Form, Formik } from "formik";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { useMutation } from "src/query";
import { ToastContext } from "src/ToastContext";
import LazyPasswordWithStrengthField from "src/components/LazyPasswordWithStrengthField";
import FormActions from "src/components/FormActions";
import Title from "src/components/Title";

interface IForm {
    password: string;
}

interface IParams {
    token?: string;
}

const useResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams() as IParams;
  const token = params.token ?? "";
  const { addToast } = useContext(ToastContext);

  const { mutateAsync: reset } = useMutation(
    async (password: string) =>
        await axios.put("/members/reset-password/", { password, token }, 
        ),
  );

  return async (
    data: IForm, { setFieldError }: FormikHelpers<IForm>,
  ) => {
    try {
        await reset(data.password);
        addToast("Success", "success");
        navigate("/login/");
    } catch (error: any) {
        if (error.response?.status === 4000) {
            if (error.response?.data.code === "WEAK_PASSWORD") {
                setFieldError("newPassword", "Password is too weak");
            } else if (error.response?.data.code === "TOKEN_EXPIRED") {
                addToast("Token expired", "error");
            }
        } else {
            addToast("Try again", "error");
        }
    }
  }
};

const validationSchema = yup.object({
    email: yup.string().email("Email invalid").required("Required"),
});

const ResetPassword = () => {
  const onSubmit = useResetPassword();

  return (
    <>
        <Title title="Reset password" />
        <Formik<IForm>
            initialValues={{ password: "" }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            { ({ dirty, isSubmitting, values }) => (
                <Form>
                    <LazyPasswordWithStrengthField
                        autoComplete="new-passwword"
                        fullWidth
                        label="Password"
                        name="password"
                        required
                    />
                    <FormActions
                        disabled={!dirty}
                        isSubmitting={isSubmitting}
                        label="Reset password"
                        links={[{label: "Login", to: "/login/"}]}
                    />
                </Form>
            )}
        </Formik>
    </>
  );
};

export default ResetPassword;
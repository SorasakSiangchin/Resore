/* eslint-disable @typescript-eslint/no-unused-vars */
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from "@mui/material";
import { useForm, FieldValues } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { history } from '../..';
import { signInUser } from './accountSlice';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';

export default function Register() {
  const dispatch = useAppDispatch();

  const {
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    // { username: "" , password: "" } ต้องใส่เป็นการผูกข้อมูล
  } = useForm<{ username: "", email: "", password: "" }>({ mode: "all" }); // mode คือ จะให้แจ้ง Error เมื่อไร

  //FieldValues คือ ค่าทั้งหมดภายใน Form
  async function submitForm(data: FieldValues) {
    // signInUser เรียกใช้ thunk
    await dispatch(signInUser(data));
    history.push("/catalog"); //มาจาก index.tsx

  }

  //setError ระบุค่าผิดพลาดให้แสดงใหม่ ที่ส่งมาจาก API
  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Email")) {
          setError("email", { message: error });
        } else if (error.includes("Username")) {
          setError("username", { message: error });
        }
      });
    }
  }


  return (
    <Container component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }} >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit((data) =>
          agent.Account.register(data)
            .then(() => {
              toast.success("Registration successful - you can now login");
              history.push("/login");
            })
            .catch((error) => handleApiErrors(error))
        )}
          noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="User name"
            autoFocus
            {...register("username", { required: "Username is required" })}
            // (!!) คือแปลงให้เป็น boolean
            error={!!errors.username}
            // helperText แสดงข้อความ
            helperText={errors?.username?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+[\w-.]*@\w+((-\w+)|(\w*)).[a-z]{2,3}$/,
                message: "Not a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors?.email?.message}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: "Password is not complex enough",
              },
            })}
            error={!!errors.password}
            helperText={errors?.password?.message}

          />
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </LoadingButton>

          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
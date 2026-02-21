import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, BioEQFormSchema } from '../types/formSchema';
import { sendBioEQRequest } from '../services/api';
import { BioEQFormData } from '../types/types';

const administrationOptions = ['Натощак', 'После еды', 'Оба варианта'] as const;

const normalizePayload = (data: BioEQFormSchema): BioEQFormData => ({
  inn: data.inn,
  dosage_form: data.dosage_form,
  dosage_form_other: data.dosage_form === 'Другое' ? data.dosage_form_other?.trim() : undefined,
  dosage: data.dosage,
  cvintra: data.cvintra,
  rsabe: data.rsabe,
  preferred_design: data.preferred_design,
  administration_mode: data.administration_mode,
  study_type: data.study_type,
  additional_requirements: {
    gender: data.additional_requirements.gender || undefined,
    age_range: data.additional_requirements.age_range?.trim() || undefined,
    other_constraints: data.additional_requirements.other_constraints?.trim() || undefined
  }
});

export const BioEQForm = () => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BioEQFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inn: '',
      dosage_form: 'Таблетки',
      dosage_form_other: '',
      dosage: '',
      cvintra: 'auto',
      rsabe: 'auto',
      preferred_design: 'auto',
      administration_mode: [],
      study_type: 'auto',
      additional_requirements: {
        gender: '',
        age_range: '',
        other_constraints: ''
      }
    }
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dosageForm = watch('dosage_form');

  const onSubmit = async (values: BioEQFormSchema) => {
    try {
      const payload = normalizePayload(values);
      await sendBioEQRequest(payload);
      setSuccessOpen(true);
      setErrorMessage('');
    } catch {
      setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте ещё раз.');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, boxShadow: '0 16px 40px rgba(24, 102, 191, 0.12)' }}>
      <Stack spacing={4} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            1. Основная информация о препарате
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="INN (МНН)"
                {...register('inn')}
                error={Boolean(errors.inn)}
                helperText={errors.inn?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean(errors.dosage_form)}>
                <InputLabel id="dosage-form-label">Лекарственная форма</InputLabel>
                <Controller
                  name="dosage_form"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} labelId="dosage-form-label" label="Лекарственная форма">
                      {['Таблетки', 'Капсулы', 'Раствор', 'Суспензия', 'Инъекционная форма', 'Другое'].map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.dosage_form?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {dosageForm === 'Другое' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Укажите лекарственную форму"
                  {...register('dosage_form_other')}
                  error={Boolean(errors.dosage_form_other)}
                  helperText={errors.dosage_form_other?.message}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Дозировка"
                placeholder="500 мг, 10 мг/мл"
                {...register('dosage')}
                error={Boolean(errors.dosage)}
                helperText={errors.dosage?.message}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            2. Параметры вариабельности
          </Typography>
          <Stack spacing={2}>
            <FormControl error={Boolean(errors.cvintra)}>
              <FormLabel>Предполагаемая внутрисубъектная вариабельность (CVintra)</FormLabel>
              <Controller
                name="cvintra"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="Низкая" control={<Radio />} label="Низкая" />
                    <FormControlLabel value="Высокая" control={<Radio />} label="Высокая" />
                    <FormControlLabel value="auto" control={<Radio />} label="Определить автоматически" />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors.cvintra?.message}</FormHelperText>
            </FormControl>

            <FormControl error={Boolean(errors.rsabe)}>
              <FormLabel>Необходимость применения RSABE</FormLabel>
              <Controller
                name="rsabe"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="Да" control={<Radio />} label="Да" />
                    <FormControlLabel value="Нет" control={<Radio />} label="Нет" />
                    <FormControlLabel value="auto" control={<Radio />} label="Определить автоматически" />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors.rsabe?.message}</FormHelperText>
            </FormControl>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            3. Дизайн исследования
          </Typography>
          <Stack spacing={2}>
            <FormControl error={Boolean(errors.preferred_design)}>
              <FormLabel>Предпочтительный дизайн</FormLabel>
              <Controller
                name="preferred_design"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="auto" control={<Radio />} label="Определить автоматически" />
                    <FormControlLabel value="2×2 crossover" control={<Radio />} label="2×2 crossover" />
                    <FormControlLabel value="Replicate" control={<Radio />} label="Replicate" />
                    <FormControlLabel value="Параллельный" control={<Radio />} label="Параллельный" />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors.preferred_design?.message}</FormHelperText>
            </FormControl>

            <FormControl error={Boolean(errors.administration_mode)}>
              <FormLabel>Режим приёма</FormLabel>
              <Controller
                name="administration_mode"
                control={control}
                render={({ field }) => (
                  <Stack direction="row" flexWrap="wrap">
                    {administrationOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={field.value.includes(option)}
                            onChange={(event) => {
                              const nextValue = event.target.checked
                                ? [...field.value, option]
                                : field.value.filter((item) => item !== option);
                              field.onChange(nextValue);
                            }}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </Stack>
                )}
              />
              <FormHelperText>{errors.administration_mode?.message}</FormHelperText>
            </FormControl>

            <FormControl error={Boolean(errors.study_type)}>
              <FormLabel>Тип исследования</FormLabel>
              <Controller
                name="study_type"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="Однократное введение" control={<Radio />} label="Однократное введение" />
                    <FormControlLabel value="Многократное введение" control={<Radio />} label="Многократное введение" />
                    <FormControlLabel value="auto" control={<Radio />} label="Определить автоматически" />
                  </RadioGroup>
                )}
              />
              <FormHelperText>{errors.study_type?.message}</FormHelperText>
            </FormControl>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            4. Дополнительные требования заказчика
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Гендерный состав</InputLabel>
                <Controller
                  name="additional_requirements.gender"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} labelId="gender-label" label="Гендерный состав">
                      <MenuItem value="">Не выбрано</MenuItem>
                      <MenuItem value="Мужчины">Мужчины</MenuItem>
                      <MenuItem value="Женщины">Женщины</MenuItem>
                      <MenuItem value="Оба пола">Оба пола</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Возрастной диапазон" placeholder="18–45 лет" {...register('additional_requirements.age_range')} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline minRows={3} label="Иные ограничения" {...register('additional_requirements.other_constraints')} />
            </Grid>
          </Grid>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)',
            transition: 'all 0.25s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 12px 24px rgba(30, 136, 229, 0.3)',
              background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
            }
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Сформировать запрос'}
        </Button>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>

      <Snackbar open={successOpen} autoHideDuration={3500} onClose={() => setSuccessOpen(false)}>
        <Alert severity="success" onClose={() => setSuccessOpen(false)}>
          Данные успешно отправлены на сервер
        </Alert>
      </Snackbar>
    </Paper>
  );
};

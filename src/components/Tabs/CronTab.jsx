import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Box,
  Button,
  Select,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import cronParser from "cron-parser";
import { setCron, fetchCron } from "../../services/firebase/cronService";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

// Cron ifadesini okunabilir formata çeviren fonksiyon
const parseCronToHumanReadable = (cronExpression) => {
  try {
    const interval = cronParser.parseExpression(cronExpression);
    const nextDate = interval.next().toDate();
    const formattedDate = format(nextDate, "d MMMM yyyy, HH:mm:ss", {
      locale: tr,
    });
    return `Sonraki tarama zamanı: ${formattedDate}`;
  } catch (err) {
    console.error("Error parsing cron expression: ", err.message);
    return "Cron ifadesi geçersiz.";
  }
};

function CronTab() {
  const [cron, setCronValue] = useState("");
  const [error, setError] = useState("");
  const [currentCron, setCurrentCron] = useState("");
  const [humanReadable, setHumanReadable] = useState("");
  const [mode, setMode] = useState("simple"); // Basit veya gelişmiş mod
  const toast = useToast(); // Toast bildirimi için

  // Cron ifadesi değiştiğinde çağrılır
  const handleCronChange = (e) => {
    const value = e.target.value;
    setCronValue(value);
    try {
      cronParser.parseExpression(value);
      setError("");
      setHumanReadable(parseCronToHumanReadable(value));
    } catch (err) {
      setError("Geçersiz cron ifadesi.");
      setHumanReadable("");
    }
  };

  const handleSaveCron = async () => {
    if (!error && cron) {
      try {
        await setCron({ schedule: cron });
        toast({
          title: "Başarılı",
          description: "Cron job başarıyla eklendi veya güncellendi!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } catch (err) {
        console.error("Cron job eklenirken veya güncellenirken hata oluştu:", err);
        toast({
          title: "Hata",
          description: `Cron job eklenirken veya güncellenirken hata oluştu: ${err.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } else {
      toast({
        title: "Geçersiz Girdi",
        description: "Geçerli bir cron ifadesi giriniz.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const fetchCurrentCron = async () => {
    try {
      const cronData = await fetchCron();
      if (cronData) {
        setCurrentCron(cronData.schedule || "");
      }
    } catch (err) {
      console.error("Cron job alınırken hata oluştu:", err);
    }
  };

  useEffect(() => {
    fetchCurrentCron();
  }, []);

  useEffect(() => {
    setCronValue(currentCron);
    setHumanReadable(parseCronToHumanReadable(currentCron));
  }, [currentCron]);

  const handleModeChange = (value) => {
    setMode(value);
    if (value === "simple") {
      // Basit modda cron ifadesini seçili olanı göster
      setCronValue(cron);
    }
  };

  return (
    <>
      <VStack spacing={6} align="stretch">
        <FormControl id="cron-mode">
          <FormLabel>Mod Seçimi</FormLabel>
          <RadioGroup value={mode} onChange={handleModeChange}>
            <VStack spacing={4} align="stretch">
              <Radio value="simple">Basit Seçenekler</Radio>
              <Radio value="advanced">Gelişmiş Seçenekler</Radio>
            </VStack>
          </RadioGroup>
        </FormControl>
        <FormControl id="cron-settings">
          <FormLabel>Cron Ayarları</FormLabel>
          {mode === "simple" ? (
            <Select
              value={cron}
              onChange={(e) => setCronValue(e.target.value)}
              placeholder="Zamanlama Seçin"
            >
              <option value="* * * * *">Her dakika</option>
              <option value="0 * * * *">Her saat</option>
              <option value="0 0 * * *">Her gün saat 00:00</option>
              <option value="0 0 * * 0">Her Pazar saat 00:00</option>
              <option value="0 0 1 * *">Her ayın 1'inde saat 00:00</option>
              <option value="0 0 1 1 *">Her yılın 1 Ocak'ında saat 00:00</option>
            </Select>
          ) : (
            <Input
              value={cron}
              onChange={handleCronChange}
              placeholder="Cron Zamanlaması"
              variant="filled"
              focusBorderColor={error ? "red.500" : "purple.500"}
            />
          )}
          {error && (
            <Text mt={2} fontSize="sm" color="red.500">
              {error}
            </Text>
          )}
          <Text mt={2} fontSize="sm" color="gray.500">
            {humanReadable}
          </Text>
          <Button
            mt={4}
            mb={4}
            onClick={handleSaveCron}
            p={"8px 16px"}
            colorScheme="purple"
          >
            Cron Ayarını Kaydet
          </Button>

          {mode === "simple" && (
            <Text fontSize="sm" color="gray.500">
              Ayarın <b>0 0 * * *</b> olması lazım yani her gece 00:00'da çalıştırır. Eğer her dakika olarak ayarlanırsa önceki işlem iptal edilir ve sonsuz döngüye girilmiş olur.
            </Text>
          )}

          {mode === "advanced" && (
            <>
              <Text fontSize="sm" color="gray.500">
                Cron ifadesi sintaksı:
              </Text>
              <Box as={"pre"} fontSize="sm" color="gray.500">
                {`
# Cron expression syntax
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of the month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of the week (0 - 6) (0 is Sunday, 6 is Saturday)
# │ │ │ │ │
# │ │ │ │ │
# │ │ │ │ │
# * * * * *`}
              </Box>
              <Box as={"pre"} fontSize="sm" color="gray.500">
                {`| field        | value                             |
| ------------ | --------------------------------- |
| second       | 0-59                              |
| minute       | 0-59                              |
| hour         | 0-23                              |
| day of month | 1-31                              |
| month        | 1-12 (or names)                   |
| day of week  | 0-7 (or names, 0 or 7 are Sunday) |`}
              </Box>
            </>
          )}

          <Text mt={4} fontSize="md" fontWeight="bold">
            Örnekler:
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
            'minute hour day(month) month day(week)'
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
            - '0 0 * * *' : Her gün saat 00:00'da çalıştır.
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
            - '*/15 * * * *' : Her 15 dakikada bir çalıştır.
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
            - '0 0 * * 0' : Her Pazar saat 00:00'da çalıştır.
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
          Daha fazla cron zamanlama örnekleri ve açıklamaları için{" "}
            <Link href="https://crontab.guru/" target="_blank" rel={"noopener"}>
              <Text as={"span"} color="purple.500">
                crontab.guru <ExternalLinkIcon mx="2px" />
              </Text>
            </Link>{" "}
            sitesini ziyaret edebilirsiniz.
          </Text>
        </FormControl>
      </VStack>
    </>
  );
}

export default CronTab;


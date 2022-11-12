import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function OTPModal(props) {
  const [otp, setOTP] = useState("");
  const handleChange = (event) => {
    setOTP(event.target.value);
  };
  const {
    isOpen: isFirstModalOpen,
    onOpen: onFirstModalOpen,
    onClose: onFirstModalClose,
  } = useDisclosure();

  const {
    isOpen: isSecondModalOpen,
    onOpen: onSecondModalOpen,
    onClose: onSecondModalClose,
  } = useDisclosure();
  const toast = useToast();

  return (
    <>
      {/* Payment Info submit */}
      <Button
        float={"right"}
        colorScheme="green"
        onClick={() => {
          if (props.checkValidForm()) {
            console.log("valid");
            props.requestOTP();
            onFirstModalOpen();
          } else {
            // Create toast on error
            toast({
              title: "Invalid Form.",
              description: "Please fill in the necessary fields.",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
        }}>
        Submit
      </Button>

      {/* OTP Modal */}
      <Modal
        closeOnEsc={false}
        isOpen={isFirstModalOpen}
        onClose={onFirstModalClose}>
        <ModalOverlay />
        <ModalContent mt={"60"}>
          <ModalHeader textAlign={"center"}>Payment OTP</ModalHeader>
          <ModalCloseButton />
          <FormControl isRequired>
            <ModalBody>
              <FormLabel>OTP</FormLabel>
              <Input bg="white" type="number" onChange={handleChange} />
            </ModalBody>

            {/* OTP Modal Submit */}
            <ModalFooter justifyContent={"center"}>
              <Button
                colorScheme="green"
                onClick={ async () => {
                  if (otp.length > 0) {
                    // Call OTP API route
                    // let otpRes;
                    // otpRes = await props.checkCustomer(otp);
                    // console.log(otpRes, "otpRes");

                    let payAttempt;
                    payAttempt = await props.pay(otp)
                    console.log(payAttempt, "payAttempt")
                    if (payAttempt && payAttempt.code === 500) {
                      onFirstModalClose();
                      onSecondModalOpen(); // Move to OTP success re520113s
                    } else {
                      // Create toast on error
                      toast({
                        title: "Error.",
                        // description: payAttempt.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                      });
                    }
                  } else {
                    // Create toast on error
                    toast({
                      title: "Invalid OTP.",
                      // description: "",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  }
                }}>
                Submit
              </Button>
            </ModalFooter>
          </FormControl>
        </ModalContent>
      </Modal>

      <>
        {/* Payment Success Modal */}
        <Modal
          closeOnEsc={false}
          isOpen={isSecondModalOpen}
          onClose={onSecondModalClose}>
          <ModalOverlay />
          <ModalContent mt={"60"}>
            <ModalHeader textAlign={"center"}>Payment Sucessful!</ModalHeader>
            <ModalCloseButton
              onClick={() => {
                onFirstModalClose();
                window.location.href = `/dashboard?cID=${props.paymentState.cID}`;
              }}
            />
          </ModalContent>
        </Modal>
      </>
    </>
  );
}

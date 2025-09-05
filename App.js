// App.js
import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
} from "@videosdk.live/react-native-sdk";
import { createMeeting, token } from "./api";

// ---------------- JOIN SCREEN ----------------
function JoinScreen({ getMeetingId }) {
  const [meetingVal, setMeetingVal] = useState("");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F6F6FF",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      {/* Create Meeting */}
      <TouchableOpacity
        onPress={() => getMeetingId()}
        style={{ backgroundColor: "#1178F8", padding: 12, borderRadius: 6 }}
      >
        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
          Create Meeting
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          alignSelf: "center",
          fontSize: 22,
          marginVertical: 16,
          fontStyle: "italic",
          color: "grey",
        }}
      >
        ---------- OR ----------
      </Text>

      {/* Enter Meeting ID */}
      <TextInput
        value={meetingVal}
        onChangeText={setMeetingVal}
        placeholder="Enter Meeting ID"
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 6,
          fontStyle: "italic",
        }}
      />

      {/* Join Meeting */}
      <TouchableOpacity
        style={{
          backgroundColor: "#1178F8",
          padding: 12,
          marginTop: 14,
          borderRadius: 6,
        }}
        onPress={() => meetingVal && getMeetingId(meetingVal)}
      >
        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
          Join Meeting
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------------- PARTICIPANT VIEW ----------------
function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn, micStream, micOn } =
    useParticipant(participantId);

  return (
    <View style={{ flex: 1 }}>
      {/* Video */}
      {webcamOn && webcamStream ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit="cover"
          style={{ flex: 1 }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>No Camera</Text>
        </View>
      )}

      {/* Audio (hidden) */}
      {micOn && micStream ? (
        <RTCView
          streamURL={new MediaStream([micStream.track]).toURL()}
          objectFit="cover"
          style={{ width: 0, height: 0 }}
        />
      ) : null}
    </View>
  );
}

// ---------------- MEETING VIEW (WHATSAPP STYLE) ----------------
function MeetingView() {
  const { join, leave, toggleWebcam, toggleMic, participants, localWebcamOn, localMicOn } =
    useMeeting();

  const participantsArr = [...participants.keys()];

  const remoteId = participantsArr[0];
  const selfId = participantsArr[1];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#333" }}>
      {/* Remote Video */}
      <View style={{ flex: 1 }}>
        {remoteId ? (
          <ParticipantView participantId={remoteId} />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Waiting for other user...</Text>
          </View>
        )}
      </View>

      {/* Self Video small preview */}
      <View
        style={{
          position: "absolute",
          bottom: 120,
          right: 20,
          width: 120,
          height: 160,
          borderRadius: 10,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "white",
        }}
      >
        {selfId ? (
          <ParticipantView participantId={selfId} />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "grey",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>You</Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* Mic */}
        <TouchableOpacity
          style={{ backgroundColor: "#444", padding: 16, borderRadius: 50 }}
          onPress={toggleMic}
        >
          <Text style={{ fontSize: 24, color: "white" }}>
            {localMicOn ? "🎤" : "🚫🎤"}
          </Text>
        </TouchableOpacity>

        {/* Camera */}
        <TouchableOpacity
          style={{ backgroundColor: "#444", padding: 16, borderRadius: 50 }}
          onPress={toggleWebcam}
        >
          <Text style={{ fontSize: 24, color: "white" }}>
            {localWebcamOn ? "📹" : "🚫📹"}
          </Text>
        </TouchableOpacity>

        {/* Join */}
        <TouchableOpacity
          style={{ backgroundColor: "green", padding: 16, borderRadius: 50 }}
          onPress={join}
        >
          <Text style={{ fontSize: 24, color: "white" }}>📞</Text>
        </TouchableOpacity>

        {/* Leave */}
        <TouchableOpacity
          style={{ backgroundColor: "red", padding: 16, borderRadius: 50 }}
          onPress={leave}
        >
          <Text style={{ fontSize: 24, color: "white" }}>❌</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------- MAIN APP ----------------
export default function App() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingId = async (id) => {
    const roomId = id ?? (await createMeeting({ token }));
    setMeetingId(roomId);
  };

  return meetingId ? (
    <SafeAreaView style={{ flex: 1 }}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: `User-${Math.floor(Math.random() * 1000)}`,
        }}
        token={token}
      >
        <MeetingView />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <JoinScreen getMeetingId={getMeetingId} />
  );
}

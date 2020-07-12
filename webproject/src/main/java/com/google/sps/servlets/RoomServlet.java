package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.Room;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class RoomServlet extends HttpServlet {
    private static Gson gson = new Gson();

    @Override
    public void doPost (HttpServletRequest request, HttpServletResponse response) throws IOException {
        Room newRoom = gson.fromJson(request.getReader(), Room.class);
        // to add some validation for new room

        URL url = new URL("https://summer20-sps-47.firebaseio.com/rooms.json");
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json; utf-8");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);

        String roomJson = gson.toJson(newRoom);

        try(OutputStream os = con.getOutputStream()) {
            byte[] input = roomJson.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        String jsonResponse = "";

        try(BufferedReader br = new BufferedReader(
                new InputStreamReader(con.getInputStream(), "utf-8"))) {
            StringBuilder firebaseResponse = new StringBuilder();
            String responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                firebaseResponse.append(responseLine.trim());
            }

            jsonResponse = firebaseResponse.toString();
        }

        response.setContentType("text/json; charset=UTF-8");
        response.getWriter().print(jsonResponse);
    }
}
